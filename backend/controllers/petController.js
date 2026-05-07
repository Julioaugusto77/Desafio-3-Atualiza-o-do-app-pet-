const Pet = require('../models/Pet');

exports.getAllPets = async (req, res) => {
  const pets = await Pet.find();
  res.json(pets);
};

exports.getPetById = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) return res.status(404).json({ message: 'Pet não encontrado.' });
  res.json(pet);
};

exports.createPet = async (req, res) => {
  const pet = await Pet.create(req.body);
  res.status(201).json(pet);
};

exports.updatePet = async (req, res) => {
  const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!pet) return res.status(404).json({ message: 'Pet não encontrado.' });
  res.json(pet);
};

exports.deletePet = async (req, res) => {
  const pet = await Pet.findByIdAndDelete(req.params.id);
  if (!pet) return res.status(404).json({ message: 'Pet não encontrado.' });
  res.json({ message: 'Pet removido com sucesso.' });
};
