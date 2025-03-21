import { TMomentPayment } from "../enums";
import { TClient, TExtendedClient } from "./cliente";

interface TProfessionalPartner {
    _id: string;
    nombre_completo: string;
    iae: number;
    precio_transferencia: number;
    precio_informe: number;
    precio_notificacion: number;
    precio_batecom: number;
    carpeta_google_drive: string;
    momento_pago: TMomentPayment;
    cliente: TClient;
    createdAt: string;
    updatedAt: string;
  }
  
  interface TExtendedProfessionalPartner extends TProfessionalPartner {
    cliente: TExtendedClient;
  }
  