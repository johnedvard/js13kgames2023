export function loadScript(url: string): Promise<any> {
  return new Promise((resolve) => {
    if ((<any>window).nearApi) resolve('');
    const script = document.createElement('script');
    script.onload = () => {
      resolve('');
    };
    script.src = url;
    document.head.appendChild(script);
  });
}
