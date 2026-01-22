// Wrapper to catch import errors
try {
  await import('./server.js');
} catch (error) {
  console.error('❌ Fatal error starting server:');
  console.error(error);
  process.exit(1);
}
