import '../src/index';
import { verifyTagRegistrations } from '../../../tests/custom-element-registration';

verifyTagRegistrations(["skyra-dropdown-menu","skyra-dropdown-item","skyra-dropdown-separator","skyra-dropdown-group"], () => import('../src/index'));
