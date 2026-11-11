/**
 * Base class for определения ноды in визуальном редакторе.
 * Используется как единый format for всех нод - and backend и frontend.
 */
class NodeDefinition {
  constructor(config) {
    this.type = config.type;
    this.category = config.category || 'Other';
    this.label = config.label || config.type;
    this.description = config.description || '';

    // Functions for вычисления пинов динамически (поддержка conditional pins)
    this.computeInputs = config.computeInputs || (() => []);
    this.computeOutputs = config.computeOutputs || (() => []);

    // Статичные пиньи (fallback for обратной совместимости)
    this.pins = config.pins || { inputs: [], outputs: [] };

    // Исполнители ноды
    // executor - for action нод with exec пинами (asynchronous)
    // evaluator - for data пинов (вычисление значений)
    this.executor = config.executor || null;
    this.evaluator = config.evaluator || null;
    this.dynamicPins = Boolean(config.dynamicPins);

    // Метаданные ноды
    this.defaultData = config.defaultData || {};
    this.theme = config.theme || {};
    this.icon = config.icon || null;
    this.graphType = config.graphType || 'ALL'; // 'COMMAND', 'EVENT', 'ALL'

    // Validation
    if (!this.type) {
      throw new Error('NodeDefinition: type is required');
    }
  }

  /**
   * Получить входные пиньи for данного state ноды
   * @param {object} data - data ноды (for условных пиннов)
   * @returns {Array} array описаний входных пиннов
   */
  getInputs(data = {}) {
    if (typeof this.computeInputs === 'function') {
      return this.computeInputs(data);
    }
    return this.pins.inputs || [];
  }

  /**
   * Получить выходные пиньи for данного state ноды
   * @param {object} data - data ноды (for условных пиннов)
   * @returns {Array} array описаний выходных пиннов
   */
  getOutputs(data = {}) {
    if (typeof this.computeOutputs === 'function') {
      return this.computeOutputs(data);
    }
    return this.pins.outputs || [];
  }

  /**
   * Проверить, является ли нода action-нодой (with exec пинами)
   */
  isActionNode() {
    const inputs = this.getInputs();
    return inputs.some(pin => pin.type === 'Exec');
  }

  /**
   * Проверить, является ли нода data-нодой (only вычисляемые values)
   */
  isDataNode() {
    return !this.isActionNode();
  }

  /**
   * Проверить, есть ли у ноды executor
   */
  hasExecutor() {
    return typeof this.executor === 'function';
  }

  /**
   * Проверить, есть ли у ноды evaluator
   */
  hasEvaluator() {
    return typeof this.evaluator === 'function';
  }

  /**
   * Конвертировать in JSON-сериализуемый format
   * Используется for отправки in frontend
   */
  toJSON() {
    const data = this.defaultData || {};
    let inputs = [];
    let outputs = [];
    try {
      inputs = this.getInputs(data) || [];
      outputs = this.getOutputs(data) || [];
    } catch {
      inputs = this.pins.inputs || [];
      outputs = this.pins.outputs || [];
    }
    return {
      type: this.type,
      category: this.category,
      label: this.label,
      description: this.description,
      dynamicPins: Boolean(this.dynamicPins),
      pins: { inputs, outputs },
      defaultData: this.defaultData,
      theme: this.theme,
      icon: this.icon,
      graphType: this.graphType,
      isActionNode: this.isActionNode()
    };
  }

  /**
   * Получить пин by ID
   * @param {string} pinId - ID pin
   * @param {string} direction - 'input' or 'output'
   */
  getPin(pinId, direction) {
    const pins = direction === 'input' ? this.pins.inputs : this.pins.outputs;
    return pins.find(pin => pin.id === pinId);
  }

  /**
   * Проверить, является ли пин обязательным
   */
  isPinRequired(pinId, direction = 'input') {
    const pin = this.getPin(pinId, direction);
    return pin?.required === true;
  }
}

/**
 * Создать определение ноды with билдером
 */
function createNodeDefinition(config) {
  return new NodeDefinition(config);
}

module.exports = { NodeDefinition, createNodeDefinition };