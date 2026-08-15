function useCmsBlock(content) {
  function getSlotContent(slotName) {
    return content.slots.find((slot) => slot.slot === slotName);
  }
  return {
    block: content,
    getSlotContent
  };
}

export { useCmsBlock as u };
