import { CLINIC } from '../data/clinic';
import { handleWhatsApp } from '../utils/whatsapp';
import { styles } from './styles';

const WhatsAppFab = () => {
  return (
    <button
      type="button"
      onClick={() =>
        handleWhatsApp(`مرحباً، أود الاستفسار عن Berard AIT داخل ${CLINIC.city}.`)
      }
      aria-label={`WhatsApp ${CLINIC.name}`}
      title="WhatsApp"
      style={styles.fab}
    >
      💬
    </button>
  );
};

export default WhatsAppFab;
