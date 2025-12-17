import { CLINIC } from '../data/clinic';
import { handleWhatsApp } from '../utils/whatsapp';
import { styles, spacing, radius, gradients, shadows, colors } from './styles';

const WhatsAppFab = () => {
  return (
    <button
      type="button"
      onClick={() =>
        handleWhatsApp(`مرحباً، أود الاستفسار عن Berard AIT داخل ${CLINIC.city}.`)
      }
      aria-label={`WhatsApp ${CLINIC.name}`}
      title="WhatsApp"
      style={{
        ...styles.fab,
        // Position above sticky CTA bar
        bottom: 140,
      }}
    >
      💬
    </button>
  );
};

export default WhatsAppFab;
