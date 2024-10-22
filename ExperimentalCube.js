/////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js
//
//  A cube that is procedurally generated
//

class ExperimentalCube {
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

        // Initialize Shader
        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        // Procedurally generate vertices and colors
        const size = 1.0; // Half the size of the cube
        const vertices = new Float32Array([
            // Front face
            -size, -size,  size,  
             size, -size,  size,  
             size,  size,  size,  
            -size,  size,  size,  

            // Back face
            -size, -size, -size,  
             size, -size, -size,  
             size,  size, -size,  
            -size,  size, -size   
        ]);

        const colors = new Float32Array([
            // Front face (Red)
            1.0, 0.0, 0.0, 1.0,  
            1.0, 0.0, 0.0, 1.0,  
            1.0, 0.0, 0.0, 1.0,  
            1.0, 0.0, 0.0, 1.0,  

            // Back face (Orange)
            1.0, 0.5, 0.0, 1.0,  
            1.0, 0.5, 0.0, 1.0,  
            1.0, 0.5, 0.0, 1.0,  
            1.0, 0.5, 0.0, 1.0 
        ]);

        // Define indices for drawing cube's triangles
        const indices = new Uint16Array([
            0, 1, 2,  0, 2, 3,
            4, 5, 6,  4, 6, 7,
            0, 1, 5,  0, 5, 4,
            2, 3, 7,  2, 7, 6,
            0, 3, 7,  0, 7, 4,
            1, 2, 6,  1, 6, 5
        ]);

        // Create and bind the vertex buffer
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Create and bind the color buffer
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

        // Create and bind the index buffer
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // Store Shader
        this.program = program;

        // Draw function for rendering cube
        this.draw = () => {
            gl.useProgram(this.program.program);

            // Upload uniforms
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program.program, 'P'), false, flatten(this.P));
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program.program, 'MV'), false, flatten(this.MV));

            // Enable vertex attribute
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            const positionLocation = gl.getAttribLocation(this.program.program, 'aPosition');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

            // Enable color attribute
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            const colorLocation = gl.getAttribLocation(this.program.program, 'aColor');
            gl.enableVertexAttribArray(colorLocation);
            gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

            // Bind index buffer and draw elements
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);  // Use indices.length for the count

            // Disable attributes
            gl.disableVertexAttribArray(positionLocation);
            gl.disableVertexAttribArray(colorLocation);

            gl.useProgram(null);
        };
    }
}
