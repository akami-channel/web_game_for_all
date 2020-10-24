    var basic_vs_source = `

        #version 300 es
        precision highp float;
        precision highp int;
        
        layout(std140, column_major) uniform;

        layout(location = 0) in vec3 position;

        out vec2 v_pos;

        uniform float time;

        uniform vec2 trans;
        uniform vec2 scale;

        void main()
        {

            v_pos = vec2(position.x + 1.0, -position.y + 1.0);
            v_pos = v_pos / 2.0;


            // vec4 popo = vec4(position.x * 1.0 + 0.0, position.y * 1.0 + 0.0, position.z, 1.0);
            gl_Position = vec4(position.x * scale.x + trans.x, position.y * scale.y + trans.y, position.z, 1.0);

            // v_pos = vec2(gl_Position.x, gl_Position.y);
            // gl_Position = vec4(position.x * scale.x / 2.0 + trans.x, position.y * scale.y / 2.0 + trans.y, position.z, 1.0f) / 1.0;

        
        }
`;

