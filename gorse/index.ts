import { Gorse } from 'gorsejs'
import express from 'express' 
import cors from 'cors' 

const app = express() 

app.use(express.urlencoded({ extended: true })) 
app.use(express.json()) 
app.use(cors()) 

// Create the client.
const client = new Gorse({
  endpoint: 'http://127.0.0.1:8088',
  secret: 'api_key',
})

app.get('/', (_, res) => {
  res.status(200).send('Welcome to port 6666')
})

// User

// Insert user
async function insert_user(uid: string, comment: string, labels: string[]) {
  client.insertUser({
      UserId: uid,
      Comment: comment,
      Labels: labels,
  })
}

app.post('/user/insert', async (req, res) => {
  const uid = req.body.UserId
  const comment = req.body.Comment
  const labels = req.body.Labels
  await insert_user(uid, comment, labels)
  res.status(200).send('OK')
})

// Update user
app.patch('/user/update', async (req, res) => {
  await client.updateUser(req.body.UserId, {
    UserId: req.body.UserId,
    Comment: req.body.Comment,
    Labels: req.body.Labels
  })
  res.status(200).send('OK')
})

// Item

//Upsert item
async function upsert_item(iid: string, comment: string, ih: boolean, ts: Date, categories: string[], labels: string[]) {
  client.upsertItem({
    ItemId: iid,
    Comment: comment,
    IsHidden: ih,
    Timestamp: ts,
    Categories: categories,
    Labels: labels
  })
}

app.post('/item/upsert', async (req, res) => {
  const iid = req.body.ItemId
  const comment = req.body.Comment
  const categories = req.body.Categories
  const labels = req.body.Labels
  await upsert_item(iid, comment, false, new Date(), categories, labels)
  res.status(200).send('OK')
})

// Update item
app.patch('/item/update', async (req, res) => {
  await client.updateItem(req.body.ItemId, {
    ItemId: req.body.ItemId,
    Comment: req.body.Comment,
    IsHidden: req.body.IsHidden,
    Timestamp: new Date(),
    Categories: req.body.Categories,
    Labels: req.body.Labels
  })
  res.status(200).send('OK')
})

// Feedback

// Insert feedbacks
async function insert_feedbacks(fbt: string, uid: string, iid: string, ts: Date) {
  client.insertFeedbacks([
    {
      FeedbackType: fbt,
      UserId: uid,
      ItemId: iid,
      Timestamp: ts
    },
  ])
}

app.post('/feedback/insert', async (req, res) => {
  const fbt = req.body.FeedbackType
  const uid = req.body.UserId
  const iid = req.body.ItemId
  await insert_feedbacks(fbt, uid, iid, new Date())
  res.status(200).send('OK')
})

// Recommend

// Get recommend
app.get('/recommend/get', async (req, res) => {
  const num = req.body.n
  const uid = req.body.userId 
  const rec = await client.getRecommend({ userId: uid, cursorOptions: {n: num}})
  res.status(200).send(rec)
})

// Connect port
app.listen(6666, () => {
  console.log('Listening on port 6666')
})

