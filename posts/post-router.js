const express = require("express")
const db = require("../data/db-config") // database access using knex

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        //SQL: `SELECT * FROM POSTS`
        res.json(await db.select("*").from("posts"))
    } catch (err) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        //SQL: SELECT * FROM posts WHERE id is param
        // db("posts").where("id", req.params.id).select()
        res.json(await db
            .select("*")
            .from("posts")
            .where("id", req.params.id)
            .first() //returns an object to parse instead of array
        )
    } catch (err) {
        next(err)
    }

})

router.post("/", async (req, res, next) => {
    try {
        const payload = {
            title: req.body.title,
            contents: req.body.contents
        }
        //SQL: `INSERT INTO posts (title, contents) VALUES(?, ?)`
        const [id] = await db("posts").insert(payload) //destructures array
        // res.json({ id }) //returns the id of the newly created row
        res.json(await db("posts").where("id", id).first()) //returns the new post instead of the id

    } catch (err) {
        next(err)
    }
})

router.put("/:id", async (req, res, next) => {
    const { id } = req.params.id
    try {
        const payload = {
            title: req.body.title,
            contents: req.body.contents
        }
        // SQL: `UPDATE posts SET title = ? AND contents = ? WHERE id = ?`
        await db("posts").where("id", req.params.id).update(payload)
        res.json(await db("posts").where("id", req.params.id).first()) //returns the new post instead of the id

    } catch (err) {
        next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        await db("posts").where("id", req.params.id).del()
        // res.status(204).end() //returns a succesful response with no content
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

module.exports = router
