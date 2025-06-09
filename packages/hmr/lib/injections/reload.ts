import initClient from "../initializers/init-client";

function addReload() {
  const reload = () => {
    chrome.runtime.reload();
  };

  initClient({
    // @ts-expect-error That's because of the dynamic code loading
    id: __HMR_ID,
    onUpdate: reload,
  });
}

addReload();
