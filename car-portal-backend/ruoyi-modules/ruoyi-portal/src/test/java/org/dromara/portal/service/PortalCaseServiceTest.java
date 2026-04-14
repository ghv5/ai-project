package org.dromara.portal.service;

import org.dromara.portal.domain.PortalCase;
import org.dromara.portal.domain.dto.PortalCaseDto;
import org.dromara.portal.mapper.PortalCaseMapper;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@Tag("dev")
public class PortalCaseServiceTest {

    @Mock
    private PortalCaseMapper portalCaseMapper;

    @InjectMocks
    private PortalCaseService portalCaseService;

    @Test
    @Disabled("IdGeneratorUtil requires Spring bean context; cover create path in integration tests instead")
    public void createShouldInsertWithDefaultFlags() {
        PortalCaseDto request = new PortalCaseDto();
        request.setTitle("case-1");

        Long caseId = portalCaseService.create(request, 1L);

        assertNotNull(caseId);
        verify(portalCaseMapper, times(1)).insert(any(PortalCase.class));
    }

    @Test
    public void updateShouldReturnFalseWhenCaseIdIsNull() {
        PortalCaseDto request = new PortalCaseDto();

        boolean result = portalCaseService.update(request, 1L);

        assertFalse(result);
        verify(portalCaseMapper, never()).updateById(any(PortalCase.class));
    }

    @Test
    public void updateShouldReturnFalseWhenRecordNotFound() {
        PortalCaseDto request = new PortalCaseDto();
        request.setCaseId(100L);
        when(portalCaseMapper.selectById(100L)).thenReturn(null);

        boolean result = portalCaseService.update(request, 1L);

        assertFalse(result);
        verify(portalCaseMapper, never()).updateById(any(PortalCase.class));
    }

    @Test
    public void deleteShouldCallMapperDeleteById() {
        when(portalCaseMapper.deleteById(10L)).thenReturn(1);

        boolean result = portalCaseService.delete(10L);

        assertTrue(result);
        verify(portalCaseMapper, times(1)).deleteById(10L);
    }

    @Test
    public void listPublicCasesShouldReturnMapperResult() {
        PortalCase entity = new PortalCase();
        entity.setCaseId(1L);
        entity.setPublished(true);
        entity.setDelFlag(0);
        when(portalCaseMapper.selectList(any())).thenReturn(List.of(entity));

        List<PortalCaseDto> result = portalCaseService.listPublicCases("test");

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getCaseId());
    }

    @Test
    public void getByIdShouldReturnNullWhenCaseIsUnpublished() {
        PortalCase entity = new PortalCase();
        entity.setCaseId(1L);
        entity.setPublished(false);
        entity.setDelFlag(0);
        when(portalCaseMapper.selectById(1L)).thenReturn(entity);

        PortalCaseDto result = portalCaseService.getById(1L);

        assertNull(result);
    }
}
