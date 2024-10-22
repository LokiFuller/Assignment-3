/////////////////////////////////////////////////////////////////////////////
//
//  IndexedCube.js
//
//  A cube defined of 12 triangles using vertex indices.
//

class IndexedCube {
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

        // Define the cube's vertices (8 vertices, 3 components each)
        const vertices = new Float32Array([
            // Front face
            -1.0, -1.0,  1.0,  
             1.0, -1.0,  1.0,  
             1.0,  1.0,  1.0,  
            -1.0,  1.0,  1.0,  

            // Back face
            -1.0, -1.0, -1.0,  
             1.0, -1.0, -1.0,  
             1.0,  1.0, -1.0,  
            -1.0,  1.0, -1.0   
        ]);

        // Define colors for each vertex (RGBA, 4 components each)
        const colors = new Float32Array([
            // Front vertices (Vertex's 0-3)
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            
            // Back vertices (Vertex's 4-7)
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0
        ]);

        // Create vertex and color attributes using the Attribute class
        this.vertexAttribute = new Attribute(gl, program, 'aPosition', vertices, 3, gl.FLOAT);
        this.colorAttribute = new Attribute(gl, program, 'aColor', colors, 4, gl.FLOAT);

        // Define the indices for drawing the cube's triangles
        const indices = new Uint16Array([
            0, 1, 2,  0, 2, 3,  // Front face
            4, 5, 6,  4, 6, 7,  // Back face
            0, 1, 5,  0, 5, 4,  // Bottom face
            2, 3, 7,  2, 7, 6,  // Top face
            0, 3, 7,  0, 7, 4,  // Left face
            1, 2, 6,  1, 6, 5   // Right face
        ]);

        // Create and bind the index buffer
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // Store
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
        
            // Bind the index buffer and draw elements
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);  // Use indices.length for the count
        
            // Disable attributes
            this.vertexAttribute.disable();
            this.colorAttribute.disable();

            gl.useProgram(null);
        };
    }
}