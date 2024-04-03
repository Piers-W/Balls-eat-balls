/* global cy */

/// <reference types="cypress" />
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

// Tests for selecting game modes
describe('Game Mode Selection', () => {
  // Tests if selecting PvE mode correctly navigates to the difficulty selection screen
    it('select PvE mode', () => {
      cy.visit('http://localhost:5173/') 
      cy.contains('button', 'Play PvE').click()
      cy.contains('h1', 'Select Difficulty').should('exist')
    })
  
    // Tests if selecting PvP mode correctly displays the interface for entering player names and room number
    it('select PvP mode', () => {
      cy.visit('http://localhost:5173/')
      cy.contains('button', 'Play PvP').click()
      cy.contains('h2', 'Enter Player Names and Room Number').should('exist')
    })
  })

// Tests for difficulty selection in PvE mode  
describe('PvE Difficulty Selection', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/') 
    cy.contains('button', 'Play PvE').click();
  });

  // Tests if Easy mode correctly sets the monster's size
  it('Easy mode', () => {
    cy.contains('button', 'Easy').click();
    cy.get('.monster').invoke('text').then((sizeText) => {
      const size = parseInt(sizeText);
      expect(size).to.be.at.least(90);
      expect(size).to.be.at.most(105);
    });
  });
  
  // Tests if Medium mode correctly sets the monster's size
  it('Medium mode', () => {
    cy.contains('button', 'Medium').click();
    cy.get('.monster').invoke('text').then((sizeText) => {
      const size = parseInt(sizeText);
      expect(size).to.be.at.least(135);
      expect(size).to.be.at.most(155);
    });
  });

  // Tests if Hard mode correctly sets the monster's size
  it('Hard mode ', () => {
    cy.contains('button', 'Hard').click();
    cy.get('.monster').invoke('text').then((sizeText) => {
      const size = parseInt(sizeText);
      expect(size).to.be.at.least(180);
      expect(size).to.be.at.most(205);
    });
  });
});
  
// Tests if the player movement control using WASD keys works correctly. 
describe('Player Movement', () => {
  //verifying that the player can move upwards by pressing the relevant key
  it('Moves the player with WASD keys', () => {
    cy.visit('http://localhost:5173/') 
    cy.contains('button', 'Play PvE').click();
    cy.contains('button', 'Easy').click();
    
    cy.get('.player').then(($player) => {
      const initialTop = $player.position().top

      cy.get('body').trigger('keydown', { keyCode: 87, which: 87 })
      cy.wait(500) 
      cy.get('.player').then(($playerAfter) => {
        const afterTop = $playerAfter.position().top
        expect(afterTop).to.be.lessThan(initialTop)
      })
    })
  })
})


// Tests that in PvE mode, the scoreboard updates correctly after a player-monster collision. 
describe('Scoreboard Update on Player-Monster Collision', () => {
  //verifying that the monster's score increases after the collision
  it('correctly updates score', () => {
    cy.visit('http://localhost:5173/') 
    cy.contains('button', 'Play PvE').click()
    cy.contains('button', 'Easy').click() 
    cy.wait(1000);

    let initialMonsterScore = 0;
    cy.get('.scoreBoard').invoke('text').then((text1) => {
      const match = /Player \d+ - (\d+) Monster/.exec(text1);
      if(match && match.length > 1) {
        initialMonsterScore = parseInt(match[1], 10);
      }

      cy.wait(5000); 
      cy.get('.scoreBoard').invoke('text').should((text2) => {
        const newMatch = /Player \d+ - (\d+) Monster/.exec(text2);
        expect(newMatch).to.be.an('array').with.length.of.at.least(2);
        const newMonsterScore = parseInt(newMatch[1], 10);
        expect(newMonsterScore).to.be.greaterThan(initialMonsterScore); 
      });
    });
  })
})

// Tests that in PvP mode, entering room numbers and player names correctly displays on the scoreboard
describe('PvP Room and Player Name Entry', () => {
  it('Displays entered player names on the scoreboard', () => {
    cy.visit('http://localhost:5173/') 
    cy.contains('button', 'Play PvP').click()
    cy.get('input[placeholder="Player 1 Name"]').type('Alice')
    cy.get('input[placeholder="Player 2 Name"]').type('Bob')
    cy.get('input[placeholder="Room Number"]').type('123')
    cy.contains('button', 'Start Game').click()
    cy.get('.scoreBoard').should('contain', 'Alice')
    cy.get('.scoreBoard').should('contain', 'Bob')
  })
})

// Tests that in PvE mode, the game returns to the main page when the player chooses not to play again after game over
describe('Game Over and Return to Main Page in PvE Mode', () => {
  it('returns to the main page when the player chooses cancel', () => {
    cy.visit('http://localhost:5173/') 
    cy.contains('button', 'Play PvE').click() 
    cy.contains('button', 'Easy').click() 
    cy.wait(10000);
    cy.on('window:confirm', () => false); 
    cy.contains('h1', 'Welcome to Balls Eat Balls').should('be.visible');
  })
})







