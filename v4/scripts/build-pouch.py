import bpy, math, os, json
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public')
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def plain(name, colour, metallic=0.0, roughness=.4):
    m=bpy.data.materials.new(name);m.diffuse_color=(*colour,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*colour,1)
    p.inputs['Metallic'].default_value=metallic;p.inputs['Roughness'].default_value=roughness
    return m

foil=plain('Black foil edges',(.016,.017,.019),.55,.34)
seam=plain('Heat sealed foil',(.025,.026,.03),.5,.31)
def printed(name, image):
    m=plain(name,(.03,.03,.03),.16,.43)
    nodes=m.node_tree.nodes;links=m.node_tree.links;p=nodes.get('Principled BSDF')
    t=nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(os.path.join(OUT,'images',image))
    links.new(t.outputs['Color'],p.inputs['Base Color'])
    noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=95;noise.inputs['Detail'].default_value=2
    bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.09;bump.inputs['Distance'].default_value=.012
    links.new(noise.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs['Normal'],p.inputs['Normal'])
    return m
front=printed('Original front artwork','pouch-front.webp');back=printed('Original back visualisation','pouch-back.webp')
nx,nz=36,54;verts=[];faces=[];uvs=[]
def point(i,j,side):
    u=i/nx;t=j/nz;x=(u*2-1)*1.06
    taper=.93+.07*math.sin(math.pi*t)
    rounding=min(t/.025,1,(1-t)/.025)
    if abs(u-.5)>.45:x*=.985+.015*max(0,rounding)
    x*=taper
    bulge=(math.sin(math.pi*u)**.65)*(math.sin(math.pi*t)**.55)
    depth=.034+.29*bulge
    if t>.88:depth*=max(.15,(1-t)/.12)
    wrinkle=.008*math.sin(u*36+t*19)*math.sin(t*42)*(1-bulge)*math.sin(math.pi*t)
    return (x,side*(depth+wrinkle),t*3.6)
for side in [-1,1]:
    for j in range(nz+1):
        for i in range(nx+1):verts.append(point(i,j,side))
stride=(nx+1)*(nz+1)
for s in range(2):
    for j in range(nz):
        for i in range(nx):
            a=s*stride+j*(nx+1)+i;b=a+1;c=b+nx+1;d=a+nx+1
            faces.append((a,b,c,d) if s==0 else (d,c,b,a))
for i in range(nx):
    faces.append((i+stride,i+1+stride,i+1,i))
    a=nz*(nx+1)+i;faces.append((a,a+1,a+1+stride,a+stride))
for j in range(nz):
    a=j*(nx+1);b=a+nx+1;faces.append((a,b,b+stride,a+stride))
    a=j*(nx+1)+nx;b=a+nx+1;faces.append((a+stride,b+stride,b,a))
mesh=bpy.data.meshes.new('Pouch surface');mesh.from_pydata(verts,[],faces);mesh.update()
body=bpy.data.objects.new('TRAYN WPC pouch',mesh);bpy.context.collection.objects.link(body)
for mat in [front,back,foil]:mesh.materials.append(mat)
uv=mesh.uv_layers.new(name='Approved artwork projection')
panel_faces=nx*nz
for p in mesh.polygons:
    p.use_smooth=True;p.material_index=0 if p.index<panel_faces else 1 if p.index<panel_faces*2 else 2
    for li in p.loop_indices:
        vi=mesh.loops[li].vertex_index % stride;j=vi//(nx+1);i=vi%(nx+1)
        u=i/nx;t=j/nz
        if p.material_index==0:uv.data[li].uv=(.079+u*.84,.075+t*.867)
        elif p.material_index==1:uv.data[li].uv=(.944-u*.894,.04+t*.914)
        else:uv.data[li].uv=(u,t)

def line(name,points,radius,material):
    curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.bevel_depth=radius;curve.bevel_resolution=2
    sp=curve.splines.new('POLY');sp.points.add(len(points)-1)
    for p,co in zip(sp.points,points):p.co=(*co,1)
    ob=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(ob);ob.data.materials.append(material);return ob

parts=[body]
for z in [3.21,3.255,3.31,3.51]:
    for side in [-1,1]:
        pts=[(x,side*(.049+.007*math.sin(x*28)),z+.007*math.sin(x*13)) for x in [-.98+1.96*i/40 for i in range(41)]]
        parts.append(line('Sealed zipper detail',pts,.009,seam))
for x in [-.99,.99]:parts.append(line('Side weld',[(x,-.035,.12),(x,-.034,3.51)],.009,foil))
parts.append(line('Bottom gusset',[(x,.16*math.sin(math.pi*i/40),.05) for i,x in enumerate([-.96+1.92*i/40 for i in range(41)])],.016,foil))

bpy.ops.object.select_all(action='DESELECT')
for p in parts:p.select_set(True)
bpy.context.view_layer.objects.active=body
os.makedirs(os.path.join(OUT,'models'),exist_ok=True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'models','trayn-pouch.glb'),export_format='GLB',use_selection=True,export_image_format='WEBP',export_image_quality=88,export_extras=True)

scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=24
scene.cycles.use_denoising=True
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
    for d in prefs.devices:d.use=True
    scene.cycles.device='GPU'
except Exception:pass
world=bpy.data.worlds.new('Charcoal studio');scene.world=world;world.use_nodes=True
world.node_tree.nodes.get('Background').inputs[0].default_value=(.045,.05,.055,1)
world.node_tree.nodes.get('Background').inputs[1].default_value=.35
scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG'
scene.render.resolution_percentage=100
def area(name,location,colour,power,size,target=(0,0,1.7)):
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.color=colour;data.shape='DISK';data.size=size
    ob=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(ob);ob.location=location
    ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
area('Silver softbox',(-3,-4,5),(1,.97,.93),650,4)
area('Red edge',(3,1.2,3),(1,.025,.045),480,2)
area('Top strip',(0,1,6),(.75,.8,1),550,3)
area('Front bounce',(1,-5,2),(1,1,1),170,3)
floor=plain('Rubberised studio floor',(.012,.013,.014),.15,.5)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.03));bpy.context.object.data.materials.append(floor)
bpy.ops.mesh.primitive_cube_add(size=1,location=(0,0,-.17));podium=bpy.context.object;podium.name='Machined plinth';podium.scale=(2.6,1.6,.3);podium.data.materials.append(plain('Graphite plinth',(.028,.03,.032),.55,.3))
bevel=podium.modifiers.new('Machined edges','BEVEL');bevel.width=.025;bevel.segments=3
camera_data=bpy.data.cameras.new('Campaign camera');camera=bpy.data.objects.new('Campaign camera',camera_data);bpy.context.collection.objects.link(camera);scene.camera=camera
def shot(name,position,target,width,height,lens=56):
    camera.location=position;camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler();camera_data.lens=lens
    scene.render.resolution_x=width;scene.render.resolution_y=height
    scene.render.filepath=os.path.join(ROOT,'artifacts',name+'.png');bpy.ops.render.render(write_still=True)

os.makedirs(os.path.join(ROOT,'artifacts'),exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'artifacts','trayn-campaign.blend'))
if '--model-only' not in __import__('sys').argv:
    shot('product-wide',(5,-10,4.5),(0,0,1.7),1600,1000)
    shot('product-phone',(4.3,-10,4.0),(0,0,1.8),900,1200)
    shot('detail-wide',(2.8,-3.4,3.55),(.1,-.15,2.65),1600,1000,67)
    shot('detail-phone',(2.5,-3.5,3.5),(.1,-.15,2.65),900,1200,67)
    camera_data.dof.use_dof=True;camera_data.dof.focus_distance=10;camera_data.dof.aperture_fstop=5.6
    shot('closing-wide',(-6,-10,3.3),(0,0,1.6),1600,900)
    shot('closing-phone',(-6,-10,3.3),(0,0,1.6),900,1200)
print('V4_MODEL',json.dumps({'vertices':len(verts),'triangles':sum(len(f)-2 for f in faces),'bytes':os.path.getsize(os.path.join(OUT,'models','trayn-pouch.glb'))}))
