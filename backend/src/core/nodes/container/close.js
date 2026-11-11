/**
 * container:close - Закрыть открытый контейнер
 *
 * Executor for action ноды with exec пинами.
 */
async function execute(node, context, helpers) {
  const { traverse } = helpers;
  const bot = context.bot;

  try {
    // Закрываем current открытый контейнер
    if (context.openContainer) {
      context.openContainer.close();
      context.openContainer = null;
    } else if (bot?.currentWindow) {
      bot.closeWindow(bot.currentWindow);
    }

    await traverse(node, 'exec');
  } catch (error) {
    // Даже when ошибке продолжаем выполнение
    await traverse(node, 'exec');
  }
}

module.exports = { execute };
