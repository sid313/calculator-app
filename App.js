import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [newNumber, setNewNumber] = useState(true);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op) => {
    setExpression(expression + display + ' ' + op + ' ');
    setNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const handlePercentage = () => {
    if (expression === '') {
      const value = parseFloat(display) / 100;
      setDisplay(value.toString());
    } else {
      const parts = expression.trim().split(' ');
      const lastNumber = parseFloat(parts[parts.length - 2]);
      const operator = parts[parts.length - 1];
      const currentNumber = parseFloat(display);
      const percentage = (lastNumber * currentNumber) / 100;
      
      if (operator === '+' || operator === '-') {
        setDisplay(percentage.toString());
      } else {
        setDisplay((currentNumber / 100).toString());
      }
    }
  };

  const calculate = () => {
    const fullExpression = expression + display;
    const expressionWithEquals = fullExpression + ' =';
    setExpression(expressionWithEquals);
    
    const numbers = fullExpression.split(/[\+\-\×\÷]/).map(num => parseFloat(num.trim()));
    const operators = fullExpression.split(/\d+\.?\d*/).filter(op => op.trim());
    
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
      switch (operators[i].trim()) {
        case '+': result += numbers[i + 1]; break;
        case '-': result -= numbers[i + 1]; break;
        case '×': result *= numbers[i + 1]; break;
        case '÷': result /= numbers[i + 1]; break;
      }
    }
    
    const historyItem = `${expressionWithEquals} ${result}`;
    setHistory(prev => [historyItem, ...prev].slice(0, 5));
    
    setDisplay(result.toString());
    setNewNumber(true);
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setNewNumber(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <TouchableOpacity 
        style={styles.historyButton} 
        onPress={() => setShowHistory(true)}
      >
        <Text style={styles.historyButtonText}>⌚</Text>
      </TouchableOpacity>

      <View style={styles.display}>
        <Text style={styles.expressionText}>{expression}</Text>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={clear}>
            <Text style={styles.clearText}>AC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleBackspace}>
            <Text style={styles.utilityText}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePercentage}>
            <Text style={styles.utilityText}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleOperation('÷')}>
            <Text style={styles.operationText}>÷</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => handleNumber('7')}>
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNumber('8')}>
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNumber('9')}>
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleOperation('×')}>
            <Text style={styles.operationText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => handleNumber('4')}>
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNumber('5')}>
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNumber('6')}>
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleOperation('-')}>
            <Text style={styles.operationText}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => handleNumber('1')}>
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNumber('2')}>
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNumber('3')}>
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleOperation('+')}>
            <Text style={styles.operationText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.zeroButton]} onPress={() => handleNumber('0')}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleNumber('.')}>
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={calculate}>
            <Text style={styles.operationText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showHistory}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>History</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.historyList}>
              {history.map((item, index) => (
                <Text key={index} style={styles.historyText}>{item}</Text>
              ))}
              {history.length === 0 && (
                <Text style={styles.noHistoryText}>No calculations yet</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  historyButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  historyButtonText: {
    fontSize: 24,
    color: '#228be6',
  },
  display: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  expressionText: {
    fontSize: 20,
    color: '#868e96',
    textAlign: 'right',
    marginBottom: 10,
  },
  displayText: {
    fontSize: 48,
    color: '#212529',
    textAlign: 'right',
  },
  buttonContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  zeroButton: {
    width: 170,
    alignItems: 'flex-start',
    paddingLeft: 32,
  },
  buttonText: {
    fontSize: 28,
    color: '#212529',
  },
  operationText: {
    fontSize: 28,
    color: '#228be6',
    fontWeight: '600',
  },
  clearText: {
    fontSize: 20,
    color: '#fa5252',
  },
  utilityText: {
    fontSize: 20,
    color: '#495057',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  closeButtonText: {
    fontSize: 28,
    color: '#868e96',
  },
  historyList: {
    marginBottom: 20,
  },
  historyText: {
    fontSize: 18,
    color: '#495057',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  noHistoryText: {
    fontSize: 16,
    color: '#868e96',
    textAlign: 'center',
    marginTop: 20,
  },
});