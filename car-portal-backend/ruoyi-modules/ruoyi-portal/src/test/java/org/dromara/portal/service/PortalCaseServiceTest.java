package org.dromara.portal.service;

import org.dromara.portal.domain.PortalCase;
import org.dromara.portal.domain.dto.PortalCaseDto;
import org.dromara.portal.mapper.PortalCaseMapper;
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
public class PortalCaseServiceTest {

    @Mock
    private PortalCaseMapper portalCaseMapper;

    @InjectMocks
    private PortalCaseService portalCaseService;

    @Test
    public void createShouldInsertWithDefaultFlags() {
        PortalCaseDto request = new PortalCaseDto();
        request.setTitle("case-1");

        Long caseId = portalCaseService.create(request);

        assertNotNull(caseId);
        verify(portalCaseMapper, times(1)).insert(any(PortalCase.class));
    }

    @Test
    public void updateShouldReturnFalseWhenCaseIdIsNull() {
        PortalCaseDto request = new PortalCaseDto();

        boolean result = portalCaseService.update(request);

        assertFalse(result);
        verify(portalCaseMapper, never()).updateById(any(PortalCase.class));
    }

    @Test
    public void updateShouldReturnFalseWhenRecordNotFound() {
        PortalCaseDto request = new PortalCaseDto();
        request.setCaseId(100L);
        when(portalCaseMapper.selectById(100L)).thenReturn(null);

        boolean result = portalCaseService.update(request);

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
        PortalCaseDto dto = new PortalCaseDto();
        dto.setCaseId(1L);
        when(portalCaseMapper.selectVoList(any())).thenReturn(List.of(dto));

        List<PortalCaseDto> result = portalCaseService.listPublicCases("test");

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getCaseId());
    }
}
