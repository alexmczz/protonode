document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const runCodeButton = document.getElementById('run-code');
    const editor = document.getElementById('editor');

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = terminalInput.value;
            console.log(`Executing command: ${command}`);  // Debug: Log the command
            window.electron.send('execute-command', command);
            terminalInput.value = '';
        }
    });

    runCodeButton.addEventListener('click', () => {
        const code = editor.value;
        console.log(`Running code: ${code}`);  // Debug: Log the code
        window.electron.send('run-code', code);
    });

    window.electron.receive('command-output', (output) => {
        console.log(`Command output: ${output}`);  // Debug: Log the output
        terminalOutput.innerHTML += `${output}\n`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });
});
