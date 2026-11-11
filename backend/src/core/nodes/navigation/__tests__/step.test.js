const { relativeOffset } = require('../relativeOffset');
const { execute } = require('../step');
const { t } = require('../../../../i18n');

function run(node, context) {
  const memo = new Map();
  const traversed = [];
  const helpers = {
    memo,
    resolvePinValue: async (current, pinId, fallback) => {
      if (current.data && Object.prototype.hasOwnProperty.call(current.data, pinId) && current.data[pinId] !== undefined) {
        return current.data[pinId];
      }
      return fallback;
    },
    traverse: async (_node, pin) => {
      traversed.push(pin);
    },
  };
  return execute(node, context, helpers).then(() => ({ memo, traversed }));
}

describe('relativeOffset', () => {
  it(t('nodes:msg_4770963b'), () => {
    const forward = relativeOffset(0, 'forward', 5);
    const right = relativeOffset(0, 'right', 5);
    const left = relativeOffset(0, 'left', 5);
    const back = relativeOffset(0, 'back', 5);
    expect(forward.x).toBeCloseTo(0);
    expect(forward.z).toBeCloseTo(-5);
    expect(right.x).toBeCloseTo(5);
    expect(right.z).toBeCloseTo(0);
    expect(left.x).toBeCloseTo(-5);
    expect(back.z).toBeCloseTo(5);
  });
});

describe('navigation:step', () => {
  it(t('nodes:msg_4c9c0aa0'), async () => {
    const goto = jest.fn(async () => {});
    const result = await run({
      id: 'step',
      data: { direction: 'forward', distance: 5 },
    }, {
      bot: {
        entity: { yaw: 0, position: { x: 10, y: 64, z: 20 } },
        pathfinder: { goto },
      },
    });

    expect(result.traversed).toEqual(['exec']);
    const goal = goto.mock.calls[0][0];
    expect(goal.x).toBeCloseTo(10);
    expect(goal.y).toBeCloseTo(64);
    expect(goal.z).toBeCloseTo(15);
    expect(result.memo.get('step:z')).toBeCloseTo(15);
  });

  it(t('nodes:msg_03ed7bc1'), async () => {
    const result = await run({
      id: 'step',
      data: { direction: 'left', distance: 2 },
    }, {
      bot: { entity: { yaw: 0, position: { x: 0, y: 64, z: 0 } } },
    });
    expect(result.traversed).toEqual(['exec_failed']);
  });
});
