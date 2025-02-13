import { createSlice } from '@reduxjs/toolkit';

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        answers: [],
        score: 0,
        time: 300, 
    },
    reducers: {
        setAnswer: (state, action) => {
            state.answers.push(action.payload);
        },
        setScore: (state, action) => {
            state.score += action.payload;
        },
        resetQuiz: (state) => {
            state.answers = [];
            state.score = 0;
            state.time = 300;
        },
    },
});

export const { setAnswer, setScore, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
