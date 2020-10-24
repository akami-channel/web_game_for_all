
var textured_fs_text = `
precision mediump float;

uniform sampler2D u_image;

varying vec2 v_texCoord;
uniform vec2 scale;
uniform vec2 offset;

void main() {
   gl_FragColor = texture2D(u_image, vec2(v_texCoord.x * scale.x + offset.x, v_texCoord.y * scale.y + offset.y));
}

`;