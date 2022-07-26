uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141592653589793238;

vec2 fixAspect(vec2 uv) {
  uv -= 0.5;
  uv.y /= resolution.x / resolution.y;
  uv += 0.5;
  return uv;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  uv = fixAspect(uv);

  // vec2 mousePos = mouse / resolution;
  // mousePos = fixAspect(mousePos);

  vec3 color = vec3(uv, sin(time) * .5 + .5);

  gl_FragColor = vec4(color, 1.0);
}