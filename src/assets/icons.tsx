import { CheckCircleTwoTone, InfoCircleTwoTone } from '@ant-design/icons';
import {
  DocumentCheckIcon,
  LightBulbIcon as HeroicLightBulbIcon,
  HomeIcon as HeroicHomeIcon,
} from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan,
  faBell,
  faBuilding,
  faBuildingUser,
  faCar,
  faCheck,
  faCheckDouble,
  faCity,
  faCross,
  faHandshakeSimple,
  faHashtag,
  faPhone,
  faSquareBinary,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export const CheckGreenIcon = <CheckCircleTwoTone twoToneColor="#52c41a" />;

export const InfoGreyIcon = <InfoCircleTwoTone />;

export const DocumentVisibleIcon = <DocumentCheckIcon className="text-gray-700 w-5 h-5" />;

export const LightBulbIcon = <HeroicLightBulbIcon className="text-gray-700 w-5 h-5" />;

export const HomeIcon = <HeroicHomeIcon className="text-gray-700 w-5 h-5" />;

export const CityIcon = <FontAwesomeIcon icon={faCity as any} className="text-gray-700 w-5 h-5" />;

export const PostalCodeIcon = <FontAwesomeIcon icon={faHashtag as any} className="text-gray-700 w-5 h-5" />;

export const UserIcon = <FontAwesomeIcon icon={faUser as any} className="text-gray-700 w-4 h-4" />;

export const BuildingIcon = <FontAwesomeIcon icon={faBuilding as any} className="text-gray-700 w-5 h-5" />;

export const BuildingUserIcon = <FontAwesomeIcon icon={faBuildingUser as any} className="text-gray-700 w-5 h-5" />;

export const HandshakeIcon = <FontAwesomeIcon icon={faHandshakeSimple as any} className="text-gray-700 w-5 h-5" />;

export const SquareBinaryIcon = <FontAwesomeIcon icon={faSquareBinary as any} className="text-gray-700 w-5 h-5" />;

export const CarIcon = <FontAwesomeIcon icon={faCar as any} className="text-gray-700 w-4 h-4" />;

export const CrossIcon: React.FC = () => <FontAwesomeIcon icon={faXmark as any} className="text-white-500 w-4 h-4" />;

export const CheckIcon: React.FC = () => <FontAwesomeIcon icon={faCheck as any} className="text-white-500 w-4 h-4" />;

export const DoubleCheckIcon: React.FC = () => (
  <FontAwesomeIcon icon={faCheckDouble as any} className="text-gray-500 w-3 h-3" />
);

export const DoubleBlueCheckIcon: React.FC = () => (
  <FontAwesomeIcon icon={faCheckDouble as any} className="text-blue-500 w-3 h-3" />
);

export const PhoneIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faPhone as any} className={`${className ? className : 'text-gray-500 w-4 h-4'}`} />
);

export const BellIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faBell as any} className={`${className ? className : 'text-gray-500 w-4 h-4'}`} />
);

export const BanIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faBan as any} className={`${className ? className : 'text-gray-500 w-4 h-4'}`} />
);
