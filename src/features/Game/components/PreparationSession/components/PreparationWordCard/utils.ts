import { ACKNOWLEDGE_LABEL, FINAL_ACKNOWLEDGE_LABEL } from '../../constants';

export function getPreparationAcknowledgeLabel(isFinalWord: boolean) {
  if (isFinalWord) {
    return FINAL_ACKNOWLEDGE_LABEL;
  }

  return ACKNOWLEDGE_LABEL;
}
