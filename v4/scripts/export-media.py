"""Local exports only. Does not submit jobs or spend media credits."""
from pathlib import Path
from PIL import Image
import subprocess
ROOT=Path(__file__).resolve().parents[1]
images=ROOT/'public/images'
video=ROOT/'public/video'
video.mkdir(parents=True,exist_ok=True)
for name in ['preparation','effort','flavour']:
    for size in ['wide','phone']:
        source=ROOT/'artifacts/campaign'/f'{name}-{size}.png'
        if source.exists():
            image=Image.open(source).convert('RGB')
            width=min(image.width,1600 if size=='wide' else 900)
            image.resize((width,round(image.height*width/image.width)),Image.Resampling.LANCZOS).save(images/f'{name}-{size}.webp',quality=88,method=6)
for name in ['product','detail','closing']:
    for size in ['wide','phone']:
        source=ROOT/'artifacts'/f'{name}-{size}.png'
        if source.exists():
            Image.open(source).convert('RGB').save(images/f'{name}-{size}.webp',quality=90,method=6)
for name in ['material','flavour']:
    for size,width,height,bitrate in [('wide',1280,720,'1500k'),('phone',720,1280,'1000k')]:
        source=images/f'{"detail" if name=="material" else "flavour"}-{size}.webp'
        vf=f"scale={width*2}:{height*2}:force_original_aspect_ratio=increase,crop={width*2}:{height*2},zoompan=z='1.025+0.018*sin(on/96*2*PI)':x='iw/2-iw/zoom/2+8*sin(on/96*2*PI)':y='ih/2-ih/zoom/2':d=96:s={width}x{height}:fps=24"
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(source),'-vf',vf,'-frames:v','96','-an','-c:v','h264_videotoolbox','-b:v',bitrate,'-pix_fmt','yuv420p','-movflags','+faststart',str(video/f'{name}-{size}.mp4')],check=True)
for size,bitrate in [('wide','1800k'),('phone','1200k')]:
    source=ROOT/'artifacts/campaign'/f'training-{size}.mp4'
    if source.exists():
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(source),'-an','-c:v','h264_videotoolbox','-b:v',bitrate,'-pix_fmt','yuv420p','-movflags','+faststart',str(video/f'training-{size}.mp4')],check=True)
print('Local media exports complete. No generation requests were made.')
