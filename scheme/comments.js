import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema({
    
    blog_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'blogs'
    },
    blog_author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'blogs',
    },
    comment: {
        type: String,
        required: true
    },
 
    commented_by: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'users'
    },
    isReply: {
        type: Boolean,
    },
    children: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }

},
{
    timestamps: {
        createdAt: 'commentedAt'
    }
})

export const commentModel=mongoose.models.comments|| mongoose.model("comments", commentSchema)