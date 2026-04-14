package org.dromara.portal.service;

import org.dromara.portal.domain.PortalHomeContent;
import org.dromara.portal.domain.dto.HomeContentDto;
import org.dromara.portal.mapper.PortalHomeContentMapper;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@Tag("dev")
public class PortalHomeServiceTest {

    @Mock
    private PortalHomeContentMapper portalHomeContentMapper;

    @InjectMocks
    private PortalHomeService portalHomeService;

    @Test
    public void shouldReadLatestHomeContentFromDatabase() {
        PortalHomeContent content = new PortalHomeContent();
        content.setHeroTitle("门户标题");
        when(portalHomeContentMapper.selectById(1L)).thenReturn(content);

        HomeContentDto result = portalHomeService.getHomeContent();

        assertNotNull(result);
        assertEquals("门户标题", result.getHeroTitle());
        verify(portalHomeContentMapper, never()).insert(any(PortalHomeContent.class));
    }

    @Test
    public void shouldCreateDefaultContentWhenDatabaseIsEmpty() {
        when(portalHomeContentMapper.selectById(1L)).thenReturn(null);

        HomeContentDto result = portalHomeService.getHomeContent();

        assertNotNull(result);
        assertEquals("", result.getHeroTitle());
        verify(portalHomeContentMapper, never()).insert(any(PortalHomeContent.class));
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
