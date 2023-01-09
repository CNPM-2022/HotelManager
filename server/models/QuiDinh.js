import mongoose from 'mongoose';

const quiDinhSchema = mongoose.Schema({
    heSo: {
        type: Number,
        required: true,
        default: 1.5,
    },
    phuThu: {
        type: Number,
        required: true,
        default: 0.25,
    },
});

const QuiDinh = mongoose.model('quidinh', quiDinhSchema);

export default QuiDinh;
