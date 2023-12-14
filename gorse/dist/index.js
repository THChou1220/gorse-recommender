"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gorsejs_1 = require("gorsejs");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Create the client.
const client = new gorsejs_1.Gorse({
    endpoint: 'http://127.0.0.1:8088',
    secret: 'api_key',
});
app.get('/', (_, res) => {
    res.status(200).send('Welcome to port 6666');
});
// User
// Insert user
function insert_user(uid, comment, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        client.insertUser({
            UserId: uid,
            Comment: comment,
            Labels: labels,
        });
    });
}
app.post('/user/insert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.body.UserId;
    const comment = req.body.Comment;
    const labels = req.body.Labels;
    yield insert_user(uid, comment, labels);
    res.status(200).send('OK');
}));
// Update user
app.patch('/user/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.updateUser(req.body.UserId, {
        UserId: req.body.UserId,
        Comment: req.body.Comment,
        Labels: req.body.Labels
    });
    res.status(200).send('OK');
}));
// Item
//Upsert item
function upsert_item(iid, comment, ih, ts, categories, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        client.upsertItem({
            ItemId: iid,
            Comment: comment,
            IsHidden: ih,
            Timestamp: ts,
            Categories: categories,
            Labels: labels
        });
    });
}
app.post('/item/upsert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const iid = req.body.ItemId;
    const comment = req.body.Comment;
    const categories = req.body.Categories;
    const labels = req.body.Labels;
    yield upsert_item(iid, comment, false, new Date(), categories, labels);
    res.status(200).send('OK');
}));
// Update item
app.patch('/item/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.updateItem(req.body.ItemId, {
        ItemId: req.body.ItemId,
        Comment: req.body.Comment,
        IsHidden: req.body.IsHidden,
        Timestamp: new Date(),
        Categories: req.body.Categories,
        Labels: req.body.Labels
    });
    res.status(200).send('OK');
}));
// Feedback
// Insert feedbacks
function insert_feedbacks(fbt, uid, iid, ts) {
    return __awaiter(this, void 0, void 0, function* () {
        client.insertFeedbacks([
            {
                FeedbackType: fbt,
                UserId: uid,
                ItemId: iid,
                Timestamp: ts
            },
        ]);
    });
}
app.post('/feedback/insert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fbt = req.body.FeedbackType;
    const uid = req.body.UserId;
    const iid = req.body.ItemId;
    yield insert_feedbacks(fbt, uid, iid, new Date());
    res.status(200).send('OK');
}));
// Recommend
// Get recommend
app.get('/recommend/get', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const num = req.body.n;
    const uid = req.body.userId;
    const rec = yield client.getRecommend({ userId: uid, cursorOptions: { n: num } });
    res.status(200).send(rec);
}));
// Connect port
app.listen(6666, () => {
    console.log('Listening on port 6666');
});
