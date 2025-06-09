import initClient from "../initializers/init-client";
function addRefresh() {
  let pendingReload = false;
  initClient({
    // @ts-expect-error That's because of the dynamic code loading
    id: __HMR_ID,
    onUpdate: () => {
      if (document.hidden) {
        pendingReload = true;
        return;
      }
      reload();
    },
  });

  function reload() {
    pendingReload = false;
    window.location.reload();
  }

  function reloadWhenTabIsVisible(): void {
    !document.hidden && pendingReload && reload();
  }

  document.addEventListener("visibilitychange", reloadWhenTabIsVisible);
}

addRefresh();
