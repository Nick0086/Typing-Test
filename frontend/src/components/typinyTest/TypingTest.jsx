import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Timer, RefreshCw, AlertCircle, TrendingUp, BarChart2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

class WordGenerator {
    constructor(chars, difficulty = 'normal') {
        this.chars = new Set(chars.split(',').map(c => c.trim()));
        this.difficulty = difficulty;
        this.commonWords = this.generateCommonWords();
    }

    generateCommonWords() {
        const words = new Set();
        const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
        const consonants = new Set([...this.chars].filter(c => !vowels.has(c)));

        // Adjust word length based on difficulty
        const maxLength = this.difficulty === 'easy' ? 3 : this.difficulty === 'hard' ? 5 : 4;

        for (let len = 2; len <= maxLength; len++) {
            this.generateWordsOfLength(len, words);
        }

        return [...words];
    }

    generateWordsOfLength(length, words) {
        const chars = [...this.chars];
        const generate = (prefix, remainingLength) => {
            if (remainingLength === 0) {
                if (this.isPronounceable(prefix)) {
                    words.add(prefix);
                }
                return;
            }

            for (const char of chars) {
                generate(prefix + char, remainingLength - 1);
            }
        };

        generate('', length);
    }

    isPronounceable(word) {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
        let hasVowel = false;
        let consonantCount = 0;

        for (let char of word) {
            if (vowels.has(char)) {
                hasVowel = true;
                consonantCount = 0;
            } else {
                consonantCount++;
            }
            if (consonantCount > 2) return false;
        }

        return hasVowel;
    }

    generateSentence() {
        const length = Math.floor(Math.random() * 6) + 3; // 3-8 words per sentence
        const words = [];

        for (let i = 0; i < length; i++) {
            const word = this.commonWords[Math.floor(Math.random() * this.commonWords.length)];
            words.push(word);
        }

        return words.join(' ') + '. ';
    }

    generateParagraph(minLength = 300) {
        let paragraph = '';
        while (paragraph.length < minLength) {
            paragraph += this.generateSentence();
        }
        return paragraph;
    }
}

const TypingTest = () => {
    const [allowedChars, setAllowedChars] = useState('a,s,d,f,g,h,j,k,l,e,i,o,u');
    const [timeLimit, setTimeLimit] = useState(60);
    const [difficulty, setDifficulty] = useState('normal');
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const [rawWpm, setRawWpm] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [validChars, setValidChars] = useState(true);
    const [typingHistory, setTypingHistory] = useState([]);
    const [consistencyScore, setConsistencyScore] = useState(100);
    const [replayData, setReplayData] = useState([]);
    const [showReplay, setShowReplay] = useState(false);

    // Timer effect
    useEffect(() => {
        let timer;
        if (started && !isFinished && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsFinished(true);
                        setStarted(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [started, isFinished, timeLeft]);

    // Calculate metrics
    const calculateMetrics = useCallback(() => {
        const timeElapsed = (timeLimit - timeLeft) / 60; // in minutes
        const wordCount = input.trim().split(/\s+/).length;
        const characters = input.length;
        const correctChars = input.split('').filter((char, i) => char === text[i]).length;

        const newErrorCount = characters - correctChars;
        setErrorCount(newErrorCount);

        const newRawWpm = Math.round(characters / 5 / timeElapsed);
        setRawWpm(newRawWpm);

        const newWpm = Math.round((correctChars / 5) / timeElapsed);
        setWpm(newWpm);

        const newAccuracy = Math.round((correctChars / Math.max(1, characters)) * 100);
        setAccuracy(newAccuracy);

        setConsistencyScore(calculateConsistency());
    }, [input, text, timeLeft, timeLimit]);

    // Track typing speed
    useEffect(() => {
        if (started && !isFinished) {
            calculateMetrics();
            const elapsed = timeLimit - timeLeft;
            if (elapsed > 0) {
                setTypingHistory(prev => [...prev, {
                    time: elapsed,
                    wpm: rawWpm,
                    accuracy: accuracy
                }]);
            }
        }
    }, [started, timeLeft, input, calculateMetrics]);

    const calculateConsistency = useCallback(() => {
        if (typingHistory.length < 2) return 100;

        const wpmValues = typingHistory.map(h => h.wpm);
        const average = wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length;
        const variance = wpmValues.reduce((a, b) => a + Math.pow(b - average, 2), 0) / wpmValues.length;
        const standardDeviation = Math.sqrt(variance);

        const maxDeviation = 30;
        const consistencyScore = Math.max(0, Math.min(100, 100 - (standardDeviation / maxDeviation * 100)));

        return Math.round(consistencyScore);
    }, [typingHistory]);

    const generateText = useCallback(() => {
        try {
            const generator = new WordGenerator(allowedChars, difficulty);
            if (generator.commonWords.length < 5) {
                setValidChars(false);
                return '';
            }
            setValidChars(true);
            return generator.generateParagraph(400);
        } catch (e) {
            console.error(e);
            setValidChars(false);
            return '';
        }
    }, [allowedChars, difficulty]);

    const startTest = useCallback(() => {
        const generatedText = generateText();
        if (!generatedText) return;

        setText(generatedText);
        setInput('');
        setStarted(true);
        setTimeLeft(timeLimit);
        setIsFinished(false);
        setWpm(0);
        setRawWpm(0);
        setAccuracy(100);
        setErrorCount(0);
        setTypingHistory([]);
        setReplayData([]);
        setShowReplay(false);
    }, [generateText, timeLimit]);

    const handleInput = useCallback((e) => {
        if (!started || isFinished) return;

        const newInput = e.target.value;
        setInput(newInput);

        recordTypingPattern(newInput[newInput.length - 1], Date.now());

        // Generate more text when reaching the end
        if (newInput.length > text.length - 100) {
            setText(prev => prev + ' ' + generateText());
        }
    }, [started, isFinished, text, generateText]);

    const recordTypingPattern = useCallback((char, timestamp) => {
        if (!char) return;

        setReplayData(prev => [...prev, {
            char,
            timestamp,
            correct: char === text[input.length]
        }]);
    }, [text, input.length]);

    const playReplay = useCallback(() => {
        if (replayData.length === 0) return;

        setShowReplay(true);
        setInput('');

        const startTime = replayData[0].timestamp;
        replayData.forEach((data, index) => {
            const delay = data.timestamp - startTime;
            setTimeout(() => {
                setInput(prev => prev + data.char);
                if (index === replayData.length - 1) {
                    setTimeout(() => setShowReplay(false), 1000);
                }
            }, delay / 5); // Speed up replay by factor of 5
        });
    }, [replayData]);

    return (
        <Card className="tw-w-full tw-max-w-4xl tw-mx-auto">
            <CardHeader>
                <CardTitle className="tw-text-2xl tw-font-bold tw-text-center">
                    Advanced Typing Test
                </CardTitle>
                <div className="tw-flex tw-justify-between tw-items-center tw-mt-4">
                    <div className="tw-space-y-2 tw-flex-1 tw-mr-4">
                        <label className="tw-block tw-text-sm">Test Characters:</label>
                        <input
                            type="text"
                            value={allowedChars}
                            onChange={(e) => setAllowedChars(e.target.value)}
                            className={`tw-w-full tw-p-2 tw-rounded tw-border ${!validChars ? 'tw-border-red-500' : ''}`}
                            disabled={started}
                        />
                    </div>
                    <div className="tw-space-y-2 tw-mx-4">
                        <label className="tw-block tw-text-sm">Difficulty:</label>
                        <Select
                            value={difficulty}
                            onValueChange={setDifficulty}
                            disabled={started}
                        >
                            <SelectTrigger className="tw-w-24">
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="tw-space-y-2">
                        <label className="tw-block tw-text-sm">Time:</label>
                        <Select
                            value={timeLimit.toString()}
                            onValueChange={(value) => setTimeLimit(parseInt(value))}
                            disabled={started}
                        >
                            <SelectTrigger className="tw-w-24">
                                <SelectValue placeholder="Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">30s</SelectItem>
                                <SelectItem value="60">60s</SelectItem>
                                <SelectItem value="90">90s</SelectItem>
                                <SelectItem value="120">120s</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="tw-space-y-4">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                    <div className="tw-flex tw-items-center tw-space-x-2">
                        <Timer className="tw-w-5 tw-h-5" />
                        <span className="tw-text-2xl tw-font-bold">{timeLeft}</span>
                        <span className="tw-text-sm">seconds left</span>
                    </div>
                    <Progress value={(timeLimit - timeLeft) / timeLimit * 100} className="tw-w-1/2" />
                </div>

                <div className="tw-relative tw-min-h-32 tw-p-4 tw-border tw-rounded tw-bg-gray-50 tw-font-mono tw-text-lg tw-leading-relaxed">
                    {text.split('').map((char, index) => (
                        <span
                            key={`${index}-${char}`}
                            className={`${index < input.length
                                ? input[index] === char
                                    ? 'tw-bg-green-200'
                                    : 'tw-bg-red-200'
                                : index === input.length
                                    ? 'tw-border-b-2 tw-border-blue-500'
                                    : ''
                                }`}
                        >
                            {char}
                        </span>
                    ))}
                </div>

                <textarea
                    value={input}
                    onChange={handleInput}
                    className="tw-w-full tw-p-4 tw-border tw-rounded tw-font-mono tw-text-lg"
                    placeholder={started ? "Start typing..." : "Press Start to begin"}
                    disabled={!started || isFinished || showReplay}
                    rows={3}
                />

                <div className="tw-flex tw-justify-between tw-items-center">
                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                        <Badge variant="secondary" className="tw-flex tw-items-center">
                            <TrendingUp className="tw-w-4 tw-h-4 tw-mr-1" /> WPM: {wpm}
                        </Badge>
                        <Badge variant="secondary" className="tw-flex tw-items-center">
                            Raw WPM: {rawWpm}
                        </Badge>
                        <Badge variant="secondary" className="tw-flex tw-items-center">
                            Accuracy: {accuracy}%
                        </Badge>
                        <Badge variant="secondary" className="tw-flex tw-items-center">
                            <BarChart2 className="tw-w-4 tw-h-4 tw-mr-1" /> Consistency: {consistencyScore}%
                        </Badge>
                    </div>
                    <div className="tw-flex tw-gap-2">
                        {isFinished && (
                            <Button
                                onClick={playReplay}
                                disabled={showReplay}
                                variant="outline"
                                className="tw-flex tw-items-center"
                            >
                                Watch Replay
                            </Button>
                        )}
                        <Button
                            onClick={startTest}
                            disabled={started || !validChars}
                            className="tw-flex tw-items-center tw-space-x-2"
                        >
                            <RefreshCw className="tw-w-4 tw-h-4" />
                            <span>Start Test</span>
                        </Button>
                    </div>
                </div>

                {typingHistory.length > 0 && (
                    <div className="tw-h-64 tw-mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={typingHistory}>
                                <XAxis
                                    dataKey="time"
                                    label={{ value: "Time (s)", position: "bottom" }}
                                />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name) => [
                                        `${Math.round(value)}${name === "accuracy" ? "%" : ""}`,
                                        name
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="wpm"
                                    stroke="#2563eb"
                                    name="WPM"
                                    dot={false}
                                    isAnimationActive={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="accuracy"
                                    stroke="#16a34a"
                                    name="Accuracy %"
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {!validChars && (
                    <div className="tw-flex tw-items-center tw-space-x-2 tw-text-red-500">
                        <AlertCircle className="tw-w-4 tw-h-4" />
                        <span className="tw-text-sm">Please enter valid characters (must include at least one vowel)</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TypingTest;