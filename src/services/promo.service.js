import * as promoRepository from "../repositories/promo.repository.js";
import * as notificationRepository from "../repositories/notification.repository.js";

export const createPromoCode = async (promoData) => {
  const existingPromo = await promoRepository.findPromoCodeByCode(
    promoData.code
  );
  if (existingPromo) {
    throw new Error("Promo code already exists");
  }

  const promo = await promoRepository.createPromoCode(promoData);

  await notificationRepository.createNotification({
    message: `New promo code ${promo.code} is available! Get ${
      promo.discount
    }% discount. Valid until ${promo.validTo.toLocaleDateString()}`,
    userId: "all",
  });

  return promo;
};

export const getAllPromoCodes = async (query) => {
  return promoRepository.findAllPromoCodes(query);
};

export const validatePromoCode = async (code) => {
  const promoCode = await promoRepository.findPromoCodeByCode(code);
  if (!promoCode) {
    throw new Error("Invalid promo code");
  }

  const now = new Date();
  if (now < promoCode.validFrom || now > promoCode.validTo) {
    throw new Error("Promo code has expired or not yet valid");
  }

  return promoCode;
};

export const updatePromoCode = async (id, promoData) => {
  const updatedPromo = await promoRepository.updatePromoCode(id, promoData);

  if (promoData.code || promoData.discount || promoData.validTo) {
    await notificationRepository.createNotification({
      message: `Promo code ${
        updatedPromo.code
      } has been updated! Now offering ${
        updatedPromo.discount
      }% discount. Valid until ${updatedPromo.validTo.toLocaleDateString()}`,
      userId: "all",
    });
  }

  return updatedPromo;
};

export const deletePromoCode = async (id) => {
  const promoCode = await promoRepository.findPromoCodeById(id);
  if (!promoCode) {
    throw new Error("Promo code not found");
  }

  await notificationRepository.createNotification({
    message: `Promo code ${promoCode.code} is no longer available`,
    userId: "all",
  });

  return promoRepository.deletePromoCode(id);
};
