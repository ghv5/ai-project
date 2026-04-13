package org.dromara.portal.service;

import org.dromara.portal.domain.PortalHomeContent;
import org.dromara.portal.domain.dto.HomeContentDto;
import org.dromara.portal.mapper.PortalHomeContentMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PortalHomeServiceTest {

    @Mock
    private PortalHomeContentMapper portalHomeContentMapper;

    @InjectMocks
    private PortalHomeService portalHomeService;

    @Test
    public void shouldReadLatestHomeContentFromDatabase() {
        HomeContentDto content = new HomeContentDto();
        content.setHeroTitle("门户标题");
        when(portalHomeContentMapper.selectVoById(1L)).thenReturn(content);

        HomeContentDto result = portalHomeService.getHomeContent();

        assertNotNull(result);
        assertEquals("门户标题", result.getHeroTitle());
        verify(portalHomeContentMapper, never()).insert(any(PortalHomeContent.class));
    }

    @Test
    public void shouldCreateDefaultContentWhenDatabaseIsEmpty() {
        when(portalHomeContentMapper.selectVoById(1L)).thenReturn(null);
        when(portalHomeContentMapper.selectById(1L)).thenReturn(null);

        HomeContentDto result = portalHomeService.getHomeContent();

        assertNotNull(result);
        assertEquals("汽车数据门户平台", result.getHeroTitle());
        verify(portalHomeContentMapper, times(1)).insert(any(PortalHomeContent.class));
    }

    @Test
    public void shouldUpdateWhenSavingExistingContent() {
        HomeContentDto request = new HomeContentDto();
        request.setHeroTitle("新标题");
        when(portalHomeContentMapper.selectById(1L)).thenReturn(new PortalHomeContent());

        portalHomeService.saveHomeContent(request);

        verify(portalHomeContentMapper, times(1)).updateById(any(PortalHomeContent.class));
        verify(portalHomeContentMapper, never()).insert(any(PortalHomeContent.class));
    }
}
