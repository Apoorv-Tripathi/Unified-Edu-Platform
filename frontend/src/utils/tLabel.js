import { useTranslation } from "react-i18next";

export const useTLabel = () => {
  const { t } = useTranslation();

  return (label) => t(label);
};