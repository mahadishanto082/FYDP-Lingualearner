import React, { useState, useEffect } from "react";
import {
  View,
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const quizzes = [
  {
    question: "What is the capital of France?",
    correctAnswer: "Paris",
    options: ["Paris", "London", "Berlin", "Madrid"],
  },
  {
    question: "Translate 'Hello' to Spanish.",
    correctAnswer: "Hola",
    options: ["Hola", "Bonjour", "Ciao", "Hallo"],
  },
  {
    question: "What is the past tense of 'go'?",
    correctAnswer: "went",
    options: ["goed", "went", "gone", "going"],
  },
  {
    question: "What is the largest planet in our Solar System?",
    correctAnswer: "Jupiter",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
  },
  {
    question: "What is 2 + 2?",
    correctAnswer: "4",
    options: ["3", "4", "5", "6"],
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    correctAnswer: "William Shakespeare",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
  },
  {
    question: "Translate 'Serendipity' to French.",
    correctAnswer: "Sérendipité",
    options: ["Sérendipité", "Bonheur", "Chance", "Destin"],
  },
];

const Quizzes = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [current]);

  const handleSelect = (option: string) => {
    const correct = option === quizzes[current].correctAnswer;
    setIsCorrect(correct);
    setSelected(option);
    if (correct) {
      setScore((prev) => prev + 1);
    }

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        setIsCorrect(null);
        setSelected(null);
        if (current + 1 < quizzes.length) {
          setCurrent((prev) => prev + 1);
        } else {
          router.push("/(tabs)/Home/homeScreen"); // ✅ Navigates after the last question
        }
      }, 1000);
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.quizContainer}>
        {current < quizzes.length ? (
          <>
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text style={styles.question}>{quizzes[current].question}</Text>
            </Animated.View>
            {quizzes[current].options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selected === option &&
                    (isCorrect ? styles.correctOption : styles.incorrectOption),
                ]}
                onPress={() => handleSelect(option)}
                disabled={selected !== null}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            {isCorrect !== null && (
              <Text
                style={isCorrect ? styles.correctText : styles.incorrectText}
              >
                {isCorrect ? "Correct! 🎉" : "Incorrect. Moving on... ❌"}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.score}>
            Your Score: {score} / {quizzes.length}
          </Text>
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/(tabs)/Home/homeScreen")}
        >
          <Ionicons name="home" size={28} color="white" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/(tabs)/Home/dictionary")}
        >
          <Ionicons name="book" size={28} color="white" />
          <Text style={styles.navText}>Dictionary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/blog/blogDetails")}
        >
          <Ionicons name="document-text-outline" size={28} color="white" />
          <Text style={styles.navText}>Blogs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  quizContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  optionButton: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    width: "80%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
  },
  correctOption: {
    backgroundColor: "#4CAF50",
  },
  incorrectOption: {
    backgroundColor: "#F44336",
  },
  correctText: {
    color: "green",
    marginTop: 20,
    fontWeight: "bold",
  },
  incorrectText: {
    color: "red",
    marginTop: 20,
    fontWeight: "bold",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },

  /* Bottom Navigation Bar */
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  navButton: {
    alignItems: "center",
    flex: 1,
  },
  navText: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },
});

export default Quizzes;
