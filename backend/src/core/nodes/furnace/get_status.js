/**
 * furnace:get_status - Печка: status
 *
 * Gets current status печки (топливо, прогресс, предметы in слотах).
 * Data нода - использует only evaluator.
 */
async function evaluate(node, pinId, context, helpers) {
  const furnace = context.openFurnace;

  if (!furnace) {
    if (pinId === 'inputItem') return null;
    if (pinId === 'fuelItem') return null;
    if (pinId === 'outputItem') return null;
    if (pinId === 'fuel') return 0;
    if (pinId === 'progress') return 0;
    if (pinId === 'isBurning') return false;
    return null;
  }

  try {
    if (pinId === 'inputItem') {
      const item = furnace.inputItem();
      if (!item) return null;
      return {
        name: item.name,
        displayName: item.displayName,
        count: item.count
      };
    }

    if (pinId === 'fuelItem') {
      const item = furnace.fuelItem();
      if (!item) return null;
      return {
        name: item.name,
        displayName: item.displayName,
        count: item.count
      };
    }

    if (pinId === 'outputItem') {
      const item = furnace.outputItem();
      if (!item) return null;
      return {
        name: item.name,
        displayName: item.displayName,
        count: item.count
      };
    }

    if (pinId === 'fuel') {
      return furnace.fuel ?? 0;
    }

    if (pinId === 'progress') {
      return furnace.progress ?? 0;
    }

    if (pinId === 'isBurning') {
      return (furnace.fuel ?? 0) > 0;
    }
  } catch (error) {
    if (pinId === 'inputItem') return null;
    if (pinId === 'fuelItem') return null;
    if (pinId === 'outputItem') return null;
    if (pinId === 'fuel') return 0;
    if (pinId === 'progress') return 0;
    if (pinId === 'isBurning') return false;
  }

  return null;
}

module.exports = { evaluate };
