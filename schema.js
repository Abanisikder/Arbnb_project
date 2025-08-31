const Joi = require('@hapi/joi');

module.exports.listingSchema = Joi.object({
    obj: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.alternatives()
        .try(
            Joi.string().uri(),
            Joi.object({
                url: Joi.string().uri().required(),
                filename: Joi.string()
            })
        )
        .required()
    }).required()
})
module.exports.listingUpdateSchema = Joi.object({
    obj: Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        location: Joi.string(),
        country: Joi.string(),
        price: Joi.number().min(0),
        image: Joi.alternatives()
            .try(
                Joi.string().uri(),
                Joi.object({
                    url: Joi.string().uri(),
                    filename: Joi.string()
                })
            ) // no .required()
    }).optional()
})


// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required(),
//         comment: Joi.string().required()
//     }).required()
// });
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().integer().min(0).max(5).required(),
        comment: Joi.string().required()
    }).required()
});
