import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';

const choices = [
  { name: 'piedra', emoji: '✊' },
  { name: 'papel', emoji: '📄' },
  { name: 'tijeras', emoji: '✂️' },
];

export default function App() {
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const getRandomChoice = () => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (playerChoice, computerChoice) => {
    if (playerChoice.name === computerChoice.name) {
      return 'empate';
    }
    
    if (
      (playerChoice.name === 'piedra' && computerChoice.name === 'tijeras') ||
      (playerChoice.name === 'papel' && computerChoice.name === 'piedra') ||
      (playerChoice.name === 'tijeras' && computerChoice.name === 'papel')
    ) {
      return 'jugador';
    }
    
    return 'computadora';
  };

  const playGame = async (playerChoice) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setGameStarted(true);
    
    // Simular delay para crear suspense
    setResult('Eligiendo...');
    setComputerChoice({ name: '?', emoji: '❓' });
    
    setTimeout(() => {
      const computerChoice = getRandomChoice();
      const winner = determineWinner(playerChoice, computerChoice);
      
      setPlayerChoice(playerChoice);
      setComputerChoice(computerChoice);
      
      if (winner === 'jugador') {
        setResult('¡Ganaste! 🎉');
        setPlayerScore(prev => prev + 1);
      } else if (winner === 'computadora') {
        setResult('¡Perdiste! 😔');
        setComputerScore(prev => prev + 1);
      } else {
        setResult('¡Empate! 🤝');
      }
      
      setIsPlaying(false);
    }, 1500);
  };

  const resetGame = () => {
    Alert.alert(
      "Reiniciar Juego",
      "¿Estás seguro que quieres reiniciar el marcador?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reiniciar",
          onPress: () => {
            setPlayerScore(0);
            setComputerScore(0);
            setPlayerChoice(null);
            setComputerChoice(null);
            setResult('');
            setGameStarted(false);
            setIsPlaying(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎮 Piedra Papel Tijeras</Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>

      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Tú</Text>
          <Text style={styles.scoreValue}>{playerScore}</Text>
        </View>
        <Text style={styles.vs}>VS</Text>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>CPU</Text>
          <Text style={styles.scoreValue}>{computerScore}</Text>
        </View>
      </View>

      {/* Game Area */}
      {gameStarted && (
        <View style={styles.gameArea}>
          <View style={styles.choicesContainer}>
            <View style={styles.choiceDisplay}>
              <Text style={styles.choiceLabel}>Tu elección:</Text>
              <Text style={styles.choiceEmoji}>
                {playerChoice ? playerChoice.emoji : '❓'}
              </Text>
              <Text style={styles.choiceName}>
                {playerChoice ? playerChoice.name : 'Esperando...'}
              </Text>
            </View>
            
            <View style={styles.choiceDisplay}>
              <Text style={styles.choiceLabel}>CPU eligió:</Text>
              <Text style={styles.choiceEmoji}>
                {computerChoice ? computerChoice.emoji : '❓'}
              </Text>
              <Text style={styles.choiceName}>
                {computerChoice ? computerChoice.name : 'Pensando...'}
              </Text>
            </View>
          </View>
          
          <Text style={[
            styles.result,
            result.includes('Ganaste') && styles.winResult,
            result.includes('Perdiste') && styles.loseResult,
            result.includes('Empate') && styles.tieResult
          ]}>
            {result}
          </Text>
        </View>
      )}

      {/* Instructions */}
      {!gameStarted && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            ¡Elige tu jugada para empezar!
          </Text>
          <Text style={styles.rulesText}>
            ✊ vence a ✂️{'\n'}
            📄 vence a ✊{'\n'}
            ✂️ vence a 📄
          </Text>
        </View>
      )}

      {/* Choice Buttons */}
      <View style={styles.buttonsContainer}>
        {choices.map((choice) => (
          <TouchableOpacity
            key={choice.name}
            style={[
              styles.choiceButton,
              isPlaying && styles.disabledButton
            ]}
            onPress={() => playGame(choice)}
            disabled={isPlaying}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonEmoji}>{choice.emoji}</Text>
            <Text style={styles.buttonText}>{choice.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ¡Que gane el mejor! 🏆
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#34495e',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#bdc3c7',
    fontSize: 16,
    marginBottom: 5,
  },
  scoreValue: {
    color: '#ecf0f1',
    fontSize: 32,
    fontWeight: 'bold',
  },
  vs: {
    color: '#f39c12',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameArea: {
    alignItems: 'center',
    marginBottom: 30,
  },
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  choiceDisplay: {
    alignItems: 'center',
    backgroundColor: '#34495e',
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
  },
  choiceLabel: {
    color: '#bdc3c7',
    fontSize: 14,
    marginBottom: 10,
  },
  choiceEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  choiceName: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ecf0f1',
    textAlign: 'center',
    marginTop: 15,
  },
  winResult: {
    color: '#2ecc71',
  },
  loseResult: {
    color: '#e74c3c',
  },
  tieResult: {
    color: '#f39c12',
  },
  instructions: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  instructionText: {
    color: '#ecf0f1',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  rulesText: {
    color: '#bdc3c7',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  choiceButton: {
    backgroundColor: '#3498db',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 90,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: '#7f8c8d',
    opacity: 0.6,
  },
  buttonEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#bdc3c7',
    fontSize: 16,
    fontStyle: 'italic',
  },
});