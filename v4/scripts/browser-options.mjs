// Installed Chrome on macOS; Playwright's pinned Chromium on Linux/CI.
export function chromiumOptions(){
 const path=process.env.PLAYWRIGHT_CHROME_PATH||(process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined);
 return{headless:true,...(path?{executablePath:path}:{})};
}
