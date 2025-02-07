import * as promoRepository from "../repositories/promo.repository.js";

export const createPromoCode = async (promoData) => {
  const existingPromo = await promoRepository.findPromoCodeByCode(
    promoData.code
  );
  if (existingPromo) {
    throw new Error("Promo code already exists");
  }

  return promoRepository.createPromoCode(promoData);
};

export const getAllPromoCodes = async (query) => {
  return promoRepository.findAllPromoCodes(query);
};

export const validatePromoCode = async (code) => {
  const promoCode = await promoRepository.findPromoCodeByCode(code);
  if (!promoCode) {
    throw new Error("Invalid promo code");
  }
  return promoCode;
};

export const updatePromoCode = async (id, promoData) => {
  return promoRepository.updatePromoCode(id, promoData);
};

export const deletePromoCode = async (id) => {
  return promoRepository.deletePromoCode(id);
};
