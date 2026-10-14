import '../src/index';
import { verifyTagRegistrations } from '../../../tests/custom-element-registration';

verifyTagRegistrations(["skyra-command-palette"], () => import('../src/index'));
