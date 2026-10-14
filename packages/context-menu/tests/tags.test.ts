import '../src/index';
import { verifyTagRegistrations } from '../../../tests/custom-element-registration';

verifyTagRegistrations(["skyra-context-menu","skyra-context-menu-item","skyra-context-menu-separator","skyra-context-menu-group"], () => import('../src/index'));
