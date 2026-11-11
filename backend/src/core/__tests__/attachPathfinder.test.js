const EventEmitter = require('events');
const { attachPathfinder, walkingMovements } = require('../attachPathfinder');
const { t } = require('../../i18n');

describe('attachPathfinder', () => {
  it(t('tests:msg_f72dd019'), () => {
    const bot = new EventEmitter();
    bot.loadPlugin = jest.fn();
    attachPathfinder(bot);
    bot.emit('inject_allowed');
    expect(bot.loadPlugin).toHaveBeenCalledTimes(1);
    expect(typeof bot.loadPlugin.mock.calls[0][0]).toBe('function');
  });

  it(t('tests:msg_25631e29'), () => {
    const bot = new EventEmitter();
    bot.pathfinder = {};
    bot.loadPlugin = jest.fn();
    attachPathfinder(bot);
    bot.emit('inject_allowed');
    expect(bot.loadPlugin).not.toHaveBeenCalled();
  });

  it(t('tests:msg_8dc16bd9'), () => {
    class FakeMovements {
      constructor() {
        this.canDig = true;
        this.scafoldingBlocks = [1, 2];
      }
    }
    const movements = walkingMovements({}, FakeMovements);
    expect(movements.canDig).toBe(false);
    expect(movements.scafoldingBlocks).toEqual([]);
  });

  it(t('tests:msg_a03af4e2'), () => {
    const bot = new EventEmitter();
    bot.loadPlugin = jest.fn(() => {
      throw new Error('no registry');
    });
    const lines = [];
    attachPathfinder(bot, (line) => lines.push(line));
    expect(() => bot.emit('inject_allowed')).not.toThrow();
    expect(lines[0]).toContain('no registry');
  });
});
