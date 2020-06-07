const { db } = require('../utils/admin');

//@x GET HOWLS

exports.getHowls = (req, res) => {
	db
		.collection('howls')
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			console.log('getHowls :::: howls-data =======================================================> ', data);
			let howls = [];
			data.forEach((doc) => {
				console.log(
					'getHowls :::: howls-data--doc ======================================================>',
					doc
				);
				howls.push({
					howlId: doc.id,
					body: doc.data().body,
					userHandle: doc.data().userHandle,
					createdAt: doc.data().createdAt,
					commentCount: doc.data().commentCount,
					likeCount: doc.data().likeCount,
					userImage: doc.data().userImage
				});
				console.log('getHowls :::: howls =================================================>', howls);
			});
			return res.json(howls);
		})
		.catch((err) => console.error(err));
};

//@X GET HOWL

exports.getHowl = (req, res) => {
	let howlData = {};

	db
		.doc(`/howls/${req.params.howlId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Bad request howl not found' });
			}
			console.log('getHowl ::: doc =================>', doc);
			howlData = doc.data();
			howlData.howlId = doc.id;
			console.log('getHowl ::: howlData ====================>', howlData);

			return db
				.collection('comments')
				.orderBy('createdAt', 'desc')
				.where('howlId', '==', req.params.howlId)
				.get();
		})
		.then((data) => {
			howlData.comments = [];
			console.log('getHowl ::: data ===========================>', data);
			data.forEach((doc) => {
				console.log('getHowl ::: doc ============================>', doc);
				howlData.comments.push(doc.data());
			});
			return res.json(howlData);
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

//@X ADD HOWL

exports.addHowl = (req, res) => {
	if (req.body.body.trim() === '') {
		return res.status(400).json({ body: 'Body must not be empty' });
	}
	const newHowl = {
		body: req.body.body,
		userHandle: req.user.handle,
		userImage: req.user.imageUrl,
		createdAt: new Date().toISOString(),
		likeCount: 0,
		commentCount: 0
	};
	console.log('createHowl :::: newHowl ==========================>', newHowl);

	db
		.collection('howls')
		.add(newHowl)
		.then((doc) => {
			console.log('createHowl ::: doc ============================>', doc);
			const resHowl = newHowl;
			resHowl.howlId = doc.id;
			return res.status(201).json(resHowl);
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({
				error: 'something went wrong'
			});
		});
};

//@X ADD COMMENT

exports.addComment = (req, res) => {
	if (req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty' });
	const newComment = {
		body: req.body.body,
		createdAt: new Date().toISOString(),
		howlId: req.params.howlId,
		userHandle: req.user.handle,
		userImage: req.user.imageUrl
	};

	db
		.doc(`/howls/${req.params.howlId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Howl not found' });
			}
			return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
		})
		.then(() => {
			return db.collection('comments').add(newComment);
		})
		.then(() => {
			res.json(newComment);
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

//@X LIKE / UNLIKE HOWL

exports.likeHowl = (req, res) => {
	const likeDoc = db
		.collection('likes')
		.where('userHandle', '==', req.user.handle)
		.where('howlId', '==', req.params.howlId)
		.limit(1);

	const howlDoc = db.doc(`/howls/${req.params.howlId}`);

	let howlData = {};

	howlDoc
		.get()
		.then((doc) => {
			if (doc.exists) {
				howlData = doc.data();
				howlData.howlId = doc.id;
				return likeDoc.get();
			} else {
				return res.status(404).json({ error: 'Howl not found' });
			}
		})
		.then((data) => {
			if (data.empty) {
				return db
					.collection('likes')
					.add({
						userHandle: req.user.handle,
						howlId: req.params.howlId
					})
					.then(() => {
						howlData.likeCount++;
						return howlDoc.update({ likeCount: howlData.likeCount });
					})
					.then(() => {
						return res.json(howlData);
					})
					.catch((err) => {
						console.error(err);
						res.status(500).json({ error: err.code });
					});
			} else {
				return res.status(400).json({ error: 'Howl already liked' });
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};

exports.unlikeHowl = (req, res) => {
	const likeDoc = db
		.collection('likes')
		.where('userHandle', '==', req.user.handle)
		.where('howlId', '==', req.params.howlId)
		.limit(1);

	const howlDoc = db.doc(`/howls/${req.params.howlId}`);

	let howlData;

	howlDoc
		.get()
		.then((doc) => {
			if (doc.exists) {
				howlData = doc.data();
				howlData.howlId = doc.id;
				return likeDoc.get();
			} else {
				return res.status(404).json({ error: 'Howl not found' });
			}
		})
		.then((data) => {
			console.log(data);
			if (data.empty) {
				return res.status(400).json({ error: 'Howl not liked' });
			} else {
				return db
					.doc(`/likes/${data.docs[0].id}`)
					.delete()
					.then(() => {
						howlData.likeCount--;
						return howlDoc.update({ likeCount: howlData.likeCount });
					})
					.then(() => {
						res.json(howlData);
					})
					.catch((err) => {
						console.error(err);
						res.status(500).json({ error: err.code });
					});
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};

exports.deleteHowl = (req, res) => {
	const howlDoc = db.doc(`/howls/${req.params.howlId}`);
	howlDoc
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: 'Howl not found' });
			}
			if (doc.data().userHandle !== req.user.handle) {
				return res.status(403).json({ error: 'Unauthorized' });
			} else {
				return howlDoc.delete();
			}
		})
		.then(() => {
			res.json({ message: 'Howl deleted successfully' });
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};
