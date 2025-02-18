import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const TranslatorApp = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');

  const translateText = async () => {
    try {
      const response = await axios.post('http://localhost:5000/translate', {
        text,
        source: sourceLang,
        target: targetLang,
      });
      setTranslatedText(response.data.translation);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Error in translation');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline Translator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text to translate"
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity style={styles.button} onPress={translateText}>
        <Text style={styles.buttonText}>Translate</Text>
      </TouchableOpacity>
      <Text style={styles.output}>{translatedText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  output: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TranslatorApp;