import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import * as THREE from 'three';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { loadBlockTextures, getBlockMaterial } from '@/pages/Bot/blockTextureLoader';
import { getEntityGeometry, getEntityMaterial, isEntityBlock } from '@/pages/Bot/entityModels';

/**
 * Modal window for выбора координат в 3D мире Minecraft
 * @param {boolean} targetBlock - if true, returns точные координаты блока;
 * if false (default), добавляет +1 к Y for навигации (точка над блоком)
 */
const CoordinatePickerDialog = ({ open, onClose, onSelect, currentCoords, targetBlock = false }) => {
  const { botId } = useParams();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const socketRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const animationFrameRef = useRef(null);
  const blocksGroupRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const highlightRef = useRef(null);
  const targetMarkerRef = useRef(null);
  const botPositionRef = useRef(null); // Сохраняем позицию бота
  const pendingBlocksRef = useRef(null); // Блоки которые пришли до инициализации

  const [connected, setConnected] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(currentCoords);
  const [loading, setLoading] = useState(true);

  const keysPressed = useRef({});
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Connection при открытии
  useEffect(() => {
    if (open && botId) {
      setLoading(true);
      setSelectedCoords(currentCoords);
      connectToBot();
    }
    return () => {
      if (!open) cleanup();
    };
  }, [open, botId]);

  // Initialization сцены ПОСЛЕ подключения
  useEffect(() => {
    if (connected && canvasRef.current && !rendererRef.current) {
      initializeScene();
      loadBlockTextures('1.20.1').catch(console.error);
    }
  }, [connected]);

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.emit('viewer:disconnect');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    botPositionRef.current = null;
    pendingBlocksRef.current = null;
    setConnected(false);
    setLoading(true);
  };

  const connectToBot = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin;
    const socket = io(`${SOCKET_URL}/minecraft-viewer`, {
      path: '/socket.io/',
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      socket.emit('viewer:connect', { botId: parseInt(botId) });
    });

    socket.on('viewer:connected', () => {
      setConnected(true);
    });

    socket.on('viewer:state', (state) => {
      console.log('[CoordinatePicker] Got state:', state.position);

      // Сохраняем позицию botа
      if (state.position) {
        botPositionRef.current = state.position;

        // Если камера уже exists - позиционируем
        if (cameraRef.current) {
          positionCameraAboveBot(state.position);
        }
      }

      // Рендерим or сохраняем блоки
      if (state.blocks) {
        if (blocksGroupRef.current) {
          renderBlocks(state.blocks);
          setLoading(false);
        } else {
          pendingBlocksRef.current = state.blocks;
        }
      }
    });

    socket.on('viewer:update', (state) => {
      if (state.blocks && blocksGroupRef.current) {
        renderBlocks(state.blocks);
      }
    });

    socket.on('viewer:error', ({ message }) => {
      console.error('[CoordinatePicker] Error:', message);
      setLoading(false);
    });

    socketRef.current = socket;
  };

  const positionCameraAboveBot = (pos) => {
    if (!cameraRef.current) return;

    // Камера сзади-сверху от botа
    cameraRef.current.position.set(pos.x - 10, pos.y + 20, pos.z + 10);
    cameraRef.current.lookAt(pos.x, pos.y, pos.z);
    console.log('[CoordinatePicker] Camera positioned at bot:', pos);
  };

  const initializeScene = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 800;
    const height = 450;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e293b);
    scene.fog = new THREE.Fog(0x1e293b, 60, 150);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500);

    // Если уже exists позиция botа - используем её
    if (botPositionRef.current) {
      const pos = botPositionRef.current;
      camera.position.set(pos.x - 10, pos.y + 20, pos.z + 10);
      camera.lookAt(pos.x, pos.y, pos.z);
    } else {
      camera.position.set(0, 80, 30);
      camera.lookAt(0, 64, 0);
    }

    // Освещение
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 100, 50);
    scene.add(dirLight);

    // Группа blocks
    const blocksGroup = new THREE.Group();
    scene.add(blocksGroup);
    blocksGroupRef.current = blocksGroup;

    // Highlight
    const highlightGeo = new THREE.BoxGeometry(1.02, 1.02, 1.02);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5,
    });
    const highlight = new THREE.Mesh(highlightGeo, highlightMat);
    highlight.visible = false;
    scene.add(highlight);
    highlightRef.current = highlight;

    // Маркер выбранной точки
    const markerGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 8);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.visible = false;
    scene.add(marker);
    targetMarkerRef.current = marker;

    // Показываем маркер if exists текущие координаты
    if (currentCoords) {
      marker.position.set(currentCoords.x + 0.5, currentCoords.y + 1.25, currentCoords.z + 0.5);
      marker.visible = true;
    }

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    // Если были pending блоки - рендерим
    if (pendingBlocksRef.current) {
      renderBlocks(pendingBlocksRef.current);
      pendingBlocksRef.current = null;
      setLoading(false);
    }

    // Animation
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // WASD движение
      const speed = 0.5;
      if (cameraRef.current) {
        const cam = cameraRef.current;
        const dir = new THREE.Vector3();
        cam.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();
        const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir);

        if (keysPressed.current['KeyW']) cam.position.addScaledVector(dir, speed);
        if (keysPressed.current['KeyS']) cam.position.addScaledVector(dir, -speed);
        if (keysPressed.current['KeyA']) cam.position.addScaledVector(right, speed);
        if (keysPressed.current['KeyD']) cam.position.addScaledVector(right, -speed);
        if (keysPressed.current['Space']) cam.position.y += speed;
        if (keysPressed.current['ShiftLeft']) cam.position.y -= speed;
      }

      renderer.render(scene, camera);
    };
    animate();
  };

  const renderBlocks = useCallback((blocks) => {
    const group = blocksGroupRef.current;
    if (!group) return;

    // Очищаем
    while (group.children.length) {
      const mesh = group.children[0];
      mesh.geometry?.dispose();
      mesh.material?.dispose();
      group.remove(mesh);
    }

    // Геометрия со смещением: блок занимает (0,0,0) до (1,1,1)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.translate(0.5, 0.5, 0.5);

    const blocksByMat = {};

    blocks.forEach(block => {
      if (!blocksByMat[block.name]) blocksByMat[block.name] = [];
      blocksByMat[block.name].push(block);
    });

    Object.entries(blocksByMat).forEach(([name, list]) => {
      // Проверяем, is ли блок entity-блоком (сундук, шалкер и т.д.)
      const isEntity = isEntityBlock(name);

      // Используем разные геометрии и материалы for entity-blocks
      const blockGeometry = isEntity ? getEntityGeometry(name) : geometry;
      const material = isEntity ? getEntityMaterial(name) : getBlockMaterial(name);

      const mesh = new THREE.InstancedMesh(blockGeometry, material, list.length);
      const matrix = new THREE.Matrix4();

      list.forEach((block, i) => {
        matrix.setPosition(block.x, block.y, block.z);
        mesh.setMatrixAt(i, matrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
      group.add(mesh);
    });

    console.log('[CoordinatePicker] Rendered', blocks.length, 'blocks');
  }, []);

  // Handlerи мыши
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const blocksGroup = blocksGroupRef.current;
    if (!canvas || !camera || !blocksGroup) return;

    // Вращение камеры при ПКМ
    if (isDragging.current) {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;

      const target = botPositionRef.current || { x: 0, y: 64, z: 0 };
      const offset = camera.position.clone().sub(new THREE.Vector3(target.x, target.y, target.z));

      // Горизонтальное вращение
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -dx * 0.005);

      // Вертикальное вращение
      const right = new THREE.Vector3().crossVectors(offset, new THREE.Vector3(0, 1, 0)).normalize();
      offset.applyAxisAngle(right, Math.max(-0.05, Math.min(0.05, -dy * 0.003)));

      camera.position.copy(new THREE.Vector3(target.x, target.y, target.z).add(offset));
      camera.lookAt(target.x, target.y, target.z);

      lastMouse.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Raycast for highlight
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycasterRef.current.intersectObjects(blocksGroup.children, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      let pos;

      if (hit.instanceId !== undefined) {
        const matrix = new THREE.Matrix4();
        hit.object.getMatrixAt(hit.instanceId, matrix);
        pos = new THREE.Vector3().setFromMatrixPosition(matrix);
      } else {
        pos = hit.object.position;
      }

      if (highlightRef.current) {
        highlightRef.current.position.set(
          Math.floor(pos.x) + 0.5,
          Math.floor(pos.y) + 0.5,
          Math.floor(pos.z) + 0.5
        );
        highlightRef.current.visible = true;
      }
    } else if (highlightRef.current) {
      highlightRef.current.visible = false;
    }
  };

  const handleClick = (e) => {
    if (e.button !== 0 || isDragging.current) return;

    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const blocksGroup = blocksGroupRef.current;
    if (!canvas || !camera || !blocksGroup) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycasterRef.current.intersectObjects(blocksGroup.children, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      let pos;

      if (hit.instanceId !== undefined) {
        const matrix = new THREE.Matrix4();
        hit.object.getMatrixAt(hit.instanceId, matrix);
        pos = new THREE.Vector3().setFromMatrixPosition(matrix);
      } else {
        pos = hit.object.position;
      }

      const coords = {
        x: Math.floor(pos.x),
        y: Math.floor(pos.y) + (targetBlock ? 0 : 1), // +1 для навигации (над блоком), 0 для точных координат блока
        z: Math.floor(pos.z)
      };

      setSelectedCoords(coords);

      if (targetMarkerRef.current) {
        // Маркер над выбранным блоком
        const markerY = targetBlock ? (coords.y + 1.5) : (coords.y + 0.5);
        targetMarkerRef.current.position.set(coords.x + 0.5, markerY, coords.z + 0.5);
        targetMarkerRef.current.visible = true;
      }
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const camera = cameraRef.current;
    if (!camera) return;

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, e.deltaY > 0 ? -3 : 3);
  };

  const handleConfirm = () => {
    if (selectedCoords) {
      onSelect(selectedCoords);
      onClose();
    }
  };

  const handleDialogClose = () => {
    cleanup();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
      <DialogContent className="max-w-4xl p-0 bg-slate-900 border-slate-700 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b border-slate-700">
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            📍 Выбор координат
            <span className="text-sm font-normal text-slate-400">
              — ЛКМ выбор, ПКМ вращение, WASD движение, колёсико зум
            </span>
          </DialogTitle>
        </DialogHeader>

        <div ref={containerRef} className="relative bg-slate-950" style={{ minHeight: 450 }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className="w-full cursor-crosshair outline-none"
            style={{ display: 'block' }}
            onMouseMove={handleMouseMove}
            onMouseDown={(e) => {
              if (e.button === 2) {
                isDragging.current = true;
                lastMouse.current = { x: e.clientX, y: e.clientY };
              }
            }}
            onMouseUp={() => { isDragging.current = false; }}
            onMouseLeave={() => { isDragging.current = false; }}
            onClick={handleClick}
            onWheel={handleWheel}
            onKeyDown={(e) => { keysPressed.current[e.code] = true; }}
            onKeyUp={(e) => { keysPressed.current[e.code] = false; }}
            onContextMenu={(e) => e.preventDefault()}
            tabIndex={0}
          />

          {/* Прицел */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="text-cyan-400/70 text-3xl font-thin select-none">+</div>
          </div>

          {/* Coordinates */}
          <div className="absolute top-3 left-3 bg-black/80 text-white px-3 py-2 rounded text-sm">
            {selectedCoords ? (
              <span className="text-green-400 font-mono">
                ✓ X: {selectedCoords.x}  Y: {selectedCoords.y}  Z: {selectedCoords.z}
              </span>
            ) : (
              <span className="text-slate-400">Кликните на блок...</span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90">
              <div className="text-center">
                <div className="text-cyan-400 text-lg animate-pulse mb-2">Загрузка мира...</div>
                <div className="text-slate-500 text-sm">Подключение к боту</div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 pt-3 border-t border-slate-700 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Бот пойдёт на выбранную позицию
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDialogClose}>
              Отмена
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedCoords}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50"
            >
              Подтвердить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoordinatePickerDialog;
