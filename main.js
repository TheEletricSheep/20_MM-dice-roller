
  
    let currentRolls = [];
    let selectedDice = new Set();
    let lastDeletedDie = null;

    const currentSides = 6;

    function rollDie(sides) {
      return Math.floor(Math.random() * sides) + 1;
    }

    function renderDice() {
      document.getElementById('rerollBtn').disabled = selectedDice.size === 0;
      document.getElementById('invertBtn').disabled = selectedDice.size === 0;
      document.getElementById('raiseBtn').disabled = selectedDice.size === 0;
      document.getElementById('lowerBtn').disabled = selectedDice.size === 0;

      const resultDiv = document.getElementById('results');

      resultDiv.innerHTML = currentRolls.map((roll, index) => `
        <div
          class="die
            ${roll.rerolled ? 'rerolled' : ''}
            ${roll.inverted ? 'inverted' : ''}
            ${roll.bonus ? 'bonus' : ''}
            ${roll.raised ? 'raised' : ''}
            ${selectedDice.has(index) ? 'selected' : ''}"
          onclick="toggleSelect(${index})"
          oncontextmenu="spendDie(event, ${index})"
        >
          ${getDieFace(roll.value)}
        </div>
      `).join('');
    }

    function getDieFace(value) {
      const faces = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8]
      };

      let html = '<div class="die-face">';

      for (let i = 0; i < 9; i++) {
        html += faces[value].includes(i)
          ? '<div class="pip"></div>'
          : '<div></div>';
      }

      html += '</div>';

      return html;
    }

    function updateDeletedDisplay() {
      const display = document.getElementById('deletedDisplay');

      if (lastDeletedDie === null) {
        display.innerHTML = '--';
        return;
      }

      display.innerHTML = `
        <div
          class="die"
          style="
            width:76px;
            height:76px;
            cursor:default;
            display:flex;
            justify-content:center;
            align-items:center;
            background-position:center;
            background-size:contain;
            position:relative;
            top:0px;
          "
        >
          ${getDieFace(lastDeletedDie)}
        </div>
      `;
    }

    function rollPool() {
      const diceCount = parseInt(document.getElementById('diceCount').value);

      currentRolls = [];

      for (let i = 0; i < diceCount; i++) {
        currentRolls.push({
          value: rollDie(currentSides),
          rerolled: false,
          inverted: false,
          bonus: false,
          raised: false
        });
      }

      selectedDice.clear();

      lastDeletedDie = null;
      updateDeletedDisplay();

      renderDice();
    }

    function toggleSelect(index) {
      selectedDice.has(index)
        ? selectedDice.delete(index)
        : selectedDice.add(index);

      renderDice();
    }

    function rerollSelected() {
      selectedDice.forEach(index => {
        currentRolls[index].value = rollDie(currentSides);
        currentRolls[index].rerolled = true;
      });

      renderDice();
    }

    function invertSelected() {
      selectedDice.forEach(index => {
        currentRolls[index].value =
          (currentSides + 1) - currentRolls[index].value;

        currentRolls[index].inverted =
          !currentRolls[index].inverted;
      });

      renderDice();
    }

    function addBonusDie() {
      currentRolls.push({
        value: 1,
        rerolled: false,
        inverted: false,
        bonus: true,
        raised: false
      });

      renderDice();
    }

    function raiseSelected() {
      let inserts = [];

      selectedDice.forEach(index => {
        let die = currentRolls[index];

        if (die.value >= currentSides) {
          inserts.push({
            index: index,
            die: {
              value: 1,
              rerolled: false,
              inverted: false,
              bonus: true,
              raised: false
            }
          });
        } else {
          die.value += 1;
          die.raised = true;
        }
      });

      inserts.forEach(item => {
        currentRolls.splice(item.index + 1, 0, item.die);
      });

      renderDice();
    }

    function lowerSelected() {
      let toRemove = [];

      selectedDice.forEach(index => {
        let die = currentRolls[index];

        if (die.value <= 1) {
          lastDeletedDie = die.value;
          toRemove.push(index);
        } else {
          die.value -= 1;
          die.raised = false;
        }
      });

      toRemove.sort((a, b) => b - a);

      toRemove.forEach(index => {
        currentRolls.splice(index, 1);
        selectedDice.delete(index);
      });

      renderDice();
      updateDeletedDisplay();
    }

    function spendDie(event, index) {
      event.preventDefault();

      lastDeletedDie = currentRolls[index].value;

      currentRolls.splice(index, 1);

      selectedDice.clear();

      renderDice();
      updateDeletedDisplay();
      
    }
window.rollPool = rollPool;
window.toggleSelect = toggleSelect;
window.rerollSelected = rerollSelected;
window.invertSelected = invertSelected;
window.addBonusDie = addBonusDie;
window.raiseSelected = raiseSelected;
window.lowerSelected = lowerSelected;
window.spendDie = spendDie;
 