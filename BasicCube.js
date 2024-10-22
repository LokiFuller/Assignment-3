/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

class BasicCube {
    constructor(gl, vertexShader, fragmentShader) {
        vertexShader ||= `
        in vec4 aPosition; 
        in vec4 aColor;
        uniform mat4 P;
        uniform mat4 MV;
        out vec4 vColor;
         void main() {
            gl_Position = P * MV * aPosition;
            vColor = aColor;
        }
        `;

        fragmentShader ||= `
        precision mediump float;
        in vec4 vColor;
        out vec4 fragColor;
        void main() {
            fragColor = vColor;
        }
        `;

        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        // Initialize Shader
        const vertices = new Float32Array([
            // Front face (z = 1.0)
            -1.0, -1.0,  1.0,  
             1.0, -1.0,  1.0,  
             1.0,  1.0,  1.0,  
            -1.0, -1.0,  1.0,  
             1.0,  1.0,  1.0,  
            -1.0,  1.0,  1.0,  
        
            // Back face (z = -1.0)
            -1.0, -1.0, -1.0,  
            -1.0,  1.0, -1.0,  
             1.0,  1.0, -1.0,  
            -1.0, -1.0, -1.0,  
             1.0,  1.0, -1.0,  
             1.0, -1.0, -1.0,  
        
            // Top face (y = 1.0)
            -1.0,  1.0, -1.0,  
            -1.0,  1.0,  1.0,  
             1.0,  1.0,  1.0,  
            -1.0,  1.0, -1.0,  
             1.0,  1.0,  1.0,  
             1.0,  1.0, -1.0,  
        
            // Bottom face (y = -1.0)
            -1.0, -1.0, -1.0,  
             1.0, -1.0, -1.0,  
             1.0, -1.0,  1.0,  
            -1.0, -1.0, -1.0,  
             1.0, -1.0,  1.0,  
            -1.0, -1.0,  1.0,  
        
            // Right face (x = 1.0)
             1.0, -1.0, -1.0,  
             1.0,  1.0, -1.0,  
             1.0,  1.0,  1.0,  
             1.0, -1.0, -1.0,  
             1.0,  1.0,  1.0,  
             1.0, -1.0,  1.0,  
        
            // Left face (x = -1.0)
            -1.0, -1.0, -1.0,  
            -1.0, -1.0,  1.0,  
            -1.0,  1.0,  1.0,  
            -1.0, -1.0, -1.0,  
            -1.0,  1.0,  1.0,  
            -1.0,  1.0, -1.0
        ]);

        // Define RGBA colors
        const colors = new Float32Array([
            // Front face (Orange)
            1.0, 0.5, 0.0, 1.0,  
            1.0, 0.5, 0.0, 1.0,  
            1.0, 0.5, 0.0, 1.0,  
            1.0, 0.5, 0.0, 1.0,  
            1.0, 0.5, 0.0, 1.0,  
            1.0, 0.5, 0.0, 1.0,
        
            // Back face (Green)
            0.0, 1.0, 0.0, 1.0,  
            0.0, 1.0, 0.0, 1.0,  
            0.0, 1.0, 0.0, 1.0,  
            0.0, 1.0, 0.0, 1.0,  
            0.0, 1.0, 0.0, 1.0,  
            0.0, 1.0, 0.0, 1.0,  
        
            // Top face (Blue)
            0.0, 0.0, 1.0, 1.0,  
            0.0, 0.0, 1.0, 1.0,  
            0.0, 0.0, 1.0, 1.0,  
            0.0, 0.0, 1.0, 1.0,  
            0.0, 0.0, 1.0, 1.0,  
            0.0, 0.0, 1.0, 1.0,  
        
            // Bottom face (Yellow)
            1.0, 1.0, 0.0, 1.0,  
            1.0, 1.0, 0.0, 1.0,  
            1.0, 1.0, 0.0, 1.0,  
            1.0, 1.0, 0.0, 1.0,  
            1.0, 1.0, 0.0, 1.0,  
            1.0, 1.0, 0.0, 1.0,  
        
            // Right face (Magenta)
            1.0, 0.0, 1.0, 1.0,  
            1.0, 0.0, 1.0, 1.0,  
            1.0, 0.0, 1.0, 1.0,  
            1.0, 0.0, 1.0, 1.0,  
            1.0, 0.0, 1.0, 1.0,  
            1.0, 0.0, 1.0, 1.0,  
        
            // Left face (Cyan)
            0.0, 1.0, 1.0, 1.0,  
            0.0, 1.0, 1.0, 1.0,  
            0.0, 1.0, 1.0, 1.0,  
            0.0, 1.0, 1.0, 1.0,  
            0.0, 1.0, 1.0, 1.0,  
            0.0, 1.0, 1.0, 1.0
        ]);

        // Create vertex and color attributes using the Attribute class
        this.vertexAttribute = new Attribute(gl, program, 'aPosition', vertices, 3, gl.FLOAT);
        this.colorAttribute = new Attribute(gl, program, 'aColor', colors, 4, gl.FLOAT);

        // Store the shader program
        this.program = program;

        // Draw function for rendering cube
        this.draw = () => {
            gl.useProgram(this.program.program);
        
            // Upload uniforms
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program.program, 'P'), false, flatten(this.P));
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program.program, 'MV'), false, flatten(this.MV));
        
            // Enable attributes
            this.vertexAttribute.enable();
            this.colorAttribute.enable();
        
            // Draw the cube as 12 triangles
            gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3); // 36 vertices = 12 triangles
        
            // Disable attributes
            this.vertexAttribute.disable();
            this.colorAttribute.disable();

            gl.useProgram(null);
        };
    }
}
