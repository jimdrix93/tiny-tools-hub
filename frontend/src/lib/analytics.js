export function track(eventName, props) {
  try {
    window.plausible && window.plausible(eventName, { props });
  } catch {}
}
