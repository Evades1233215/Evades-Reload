/**
 * Makes dom element from object
 * @param {{name: string, id: number, firstColor: string, secondColor: string}} character
 * @param {(id: number) => void} selectHeroCallback
 * @returns
 */
function fromCharacterToDom(character, selectHeroCallback) {
    const button = document.createElement('button');
    button.class = 'character';
    button.style.backgroundColor = character.secondColor;
    button.style.color = character.firstColor;
    button.style.border = `3px solid ${character.firstColor}`;
    button.addEventListener('click', () => selectHeroCallback(character.id));
    button.innerText = character.name;
  
    return button;
  }
  
  export { fromCharacterToDom };
  