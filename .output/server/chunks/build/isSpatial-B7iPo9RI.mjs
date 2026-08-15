function isSpatial(media) {
  return media.fileExtension === "glb" || !!media.url?.endsWith(".glb");
}

export { isSpatial as i };
